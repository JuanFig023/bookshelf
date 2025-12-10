import { Context } from '../index';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export const Mutation = {
  // Auth mutations
  register: async (
    _: any,
    { email, password, name }: { email: string; password: string; name: string },
    { prisma, res }: any
  ) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'USER',
      },
    });

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  login: async (
    _: any,
    { email, password }: { email: string; password: string },
    { prisma, res }: any
  ) => {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const valid = await comparePassword(password, user.passwordHash);

    if (!valid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  logout: async (_: any, __: any, { res }: any) => {
    res.clearCookie('token', { 
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    return true;
  },

  // Book mutations
  createBook: async (
    _: any,
    args: {
      title: string;
      author: string;
      isbn?: string;
      description?: string;
      coverImage?: string;
      genre?: string;
    },
    { prisma }: Context
  ) => {
    return prisma.book.create({
      data: args,
    });
  },

  updateBook: async (
    _: any,
    { id, ...data }: any,
    { prisma }: Context
  ) => {
    return prisma.book.update({
      where: { id },
      data,
    });
  },

  deleteBook: async (_: any, { id }: { id: string }, { prisma }: Context) => {
    // First, get all editions for this book
    const editions = await prisma.edition.findMany({
      where: { bookId: id },
      select: { id: true },
    });

    // Delete all checkouts for these editions
    if (editions.length > 0) {
      await prisma.checkout.deleteMany({
        where: {
          editionId: {
            in: editions.map(e => e.id),
          },
        },
      });

      // Delete all editions
      await prisma.edition.deleteMany({
        where: { bookId: id },
      });
    }

    // Finally, delete the book
    await prisma.book.delete({
      where: { id },
    });
    return true;
  },

  // Edition mutations
  createEdition: async (
    _: any,
    args: {
      bookId: string;
      format: any;
      publisher?: string;
      year?: number;
      totalCopies: number;
    },
    { prisma }: Context
  ) => {
    return prisma.edition.create({
      data: {
        bookId: args.bookId,
        format: args.format,
        publisher: args.publisher,
        year: args.year,
        totalCopies: args.totalCopies,
      },
    });
  },

  updateEdition: async (
    _: any,
    { id, ...data }: any,
    { prisma }: Context
  ) => {
    return prisma.edition.update({
      where: { id },
      data,
    });
  },

  deleteEdition: async (_: any, { id }: { id: string }, { prisma }: Context) => {
    await prisma.edition.delete({
      where: { id },
    });
    return true;
  },

  // Checkout mutations
  checkoutEdition: async (
    _: any,
    { editionId }: { editionId: string },
    { prisma, user }: Context
  ) => {
    // Validate user is authenticated
    if (!user) {
      throw new Error('You must be logged in to checkout a book');
    }

    // Check if user has less than 5 active checkouts
    const activeCheckouts = await prisma.checkout.count({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
    });

    if (activeCheckouts >= 5) {
      throw new Error('You have reached the maximum of 5 active checkouts');
    }

    // Check if edition has available copies
    const edition = await prisma.edition.findUnique({
      where: { id: editionId },
      include: {
        checkouts: {
          where: {
            status: 'ACTIVE',
          },
        },
      },
    });

    if (!edition) {
      throw new Error('Edition not found');
    }

    const availableCopies = edition.totalCopies - edition.checkouts.length;

    if (availableCopies <= 0) {
      throw new Error('No copies available for checkout');
    }

    // Create checkout with dueDate = today + 14 days
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    return prisma.checkout.create({
      data: {
        userId: user.id,
        editionId,
        dueDate,
        status: 'ACTIVE',
      },
    });
  },
  returnCheckout: async (
    _: any,
    { checkoutId }: { checkoutId: string },
    { prisma, user }: Context
  ) => {
    // Validate user is authenticated
    if (!user) {
      throw new Error('You must be logged in to return a book');
    }

    // Find checkout
    const checkout = await prisma.checkout.findUnique({
      where: { id: checkoutId },
    });

    if (!checkout) {
      throw new Error('Checkout not found');
    }

    // Validate user owns this checkout
    if (checkout.userId !== user.id) {
      throw new Error('You can only return your own checkouts');
    }

    // Update checkout with return date and status
    return prisma.checkout.update({
      where: { id: checkoutId },
      data: {
        returnDate: new Date(),
        status: 'RETURNED',
      },
    });
  },
  renewCheckout: async (
    _: any,
    { checkoutId }: { checkoutId: string },
    { prisma, user }: Context
  ) => {
    // Validate user is authenticated
    if (!user) {
      throw new Error('You must be logged in to renew a checkout');
    }

    // Find checkout
    const checkout = await prisma.checkout.findUnique({
      where: { id: checkoutId },
    });

    if (!checkout) {
      throw new Error('Checkout not found');
    }

    // Validate user owns this checkout
    if (checkout.userId !== user.id) {
      throw new Error('You can only renew your own checkouts');
    }

    // Validate renewCount < 2
    if (checkout.renewCount >= 2) {
      throw new Error('You have reached the maximum of 2 renewals for this checkout');
    }

    // Extend dueDate by 14 days
    const newDueDate = new Date(checkout.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    // Update checkout
    return prisma.checkout.update({
      where: { id: checkoutId },
      data: {
        dueDate: newDueDate,
        renewCount: checkout.renewCount + 1,
      },
    });
  },
};
