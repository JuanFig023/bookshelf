import { Context } from '../index';

export const Book = {
  editions: async (parent: any, _: any, { prisma }: Context) => {
    return prisma.edition.findMany({
      where: { bookId: parent.id },
    });
  },
};

export const Edition = {
  book: async (parent: any, _: any, { prisma }: Context) => {
    return prisma.book.findUnique({
      where: { id: parent.bookId },
    });
  },

  availableCopies: async (parent: any, _: any, { prisma }: Context) => {
    const activeCheckouts = await prisma.checkout.count({
      where: {
        editionId: parent.id,
        status: 'ACTIVE',
      },
    });
    return parent.totalCopies - activeCheckouts;
  },

  checkouts: async (parent: any, _: any, { prisma }: Context) => {
    return prisma.checkout.findMany({
      where: { editionId: parent.id },
    });
  },
};

export const User = {
  checkouts: async (parent: any, _: any, { prisma }: Context) => {
    return prisma.checkout.findMany({
      where: { userId: parent.id },
    });
  },
};

export const Checkout = {
  user: async (parent: any, _: any, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: { id: parent.userId },
    });
  },

  edition: async (parent: any, _: any, { prisma }: Context) => {
    return prisma.edition.findUnique({
      where: { id: parent.editionId },
    });
  },

  checkoutDate: (parent: any) => {
    return parent.checkoutDate ? new Date(parent.checkoutDate).toISOString() : null;
  },

  dueDate: (parent: any) => {
    return parent.dueDate ? new Date(parent.dueDate).toISOString() : null;
  },

  returnDate: (parent: any) => {
    return parent.returnDate ? new Date(parent.returnDate).toISOString() : null;
  },

  createdAt: (parent: any) => {
    return parent.createdAt ? new Date(parent.createdAt).toISOString() : null;
  },
};
