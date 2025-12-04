import { Context } from '../index';

export const Query = {
  // Book queries
  books: async (_: any, __: any, { prisma }: Context) => {
    return prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  book: async (_: any, { id }: { id: string }, { prisma }: Context) => {
    return prisma.book.findUnique({
      where: { id },
    });
  },

  // Edition queries
  editions: async (_: any, __: any, { prisma }: Context) => {
    return prisma.edition.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  edition: async (_: any, { id }: { id: string }, { prisma }: Context) => {
    return prisma.edition.findUnique({
      where: { id },
    });
  },

  // User queries
  me: async (_: any, __: any, { user, prisma }: Context) => {
    if (!user) return null;
    return prisma.user.findUnique({
      where: { id: user.id },
    });
  },

  // Checkout queries
  myCheckouts: async (_: any, __: any, { user, prisma }: Context) => {
    if (!user) {
      throw new Error('Not authenticated');
    }
    return prisma.checkout.findMany({
      where: { userId: user.id },
      orderBy: { checkoutDate: 'desc' },
    });
  },
};
