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
import { verifyToken } from './utils/auth';

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
  req?: any;
  res?: any;
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
        // Extract JWT from cookie
        const token = req.cookies?.token;
        
        let user = undefined;
        if (token) {
          const payload = verifyToken(token);
          if (payload) {
            user = {
              id: payload.userId,
              email: payload.email,
              role: payload.role,
            };
          }
        }

        return {
          prisma,
          user,
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
