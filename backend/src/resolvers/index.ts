import { Query } from './queries';
import { Mutation } from './mutations';
import { Book, Edition, User, Checkout } from './fieldResolvers';

export const resolvers = {
  Query,
  Mutation,
  Book,
  Edition,
  User,
  Checkout,
};
