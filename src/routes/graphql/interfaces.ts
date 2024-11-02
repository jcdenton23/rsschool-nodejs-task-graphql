import { PrismaClient } from '@prisma/client';
import { createLoaders } from './loaders.js';
export interface Context {
  prisma: PrismaClient;
  loaders: ReturnType<typeof createLoaders>;
}
