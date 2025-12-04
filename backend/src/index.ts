import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { resolvers } from './resolvers';
import { prisma } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Read GraphQL schema
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

// Context type
export interface Context {
  prisma: typeof prisma;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

async function startServer() {
  // Create Apollo Server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  // GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        // TODO: Extract user from JWT cookie (we'll add this when implementing auth)
        return {
          prisma,
          req,
          res,
        };
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
