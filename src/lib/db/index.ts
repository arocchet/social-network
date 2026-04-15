import { PrismaClient } from '@prisma/client'

// Determine database URL based on environment, but avoid throwing at import time.
const databaseUrl = process.env.NODE_ENV === 'test'
  ? process.env.DATABASE_TEST_URL
  : process.env.DATABASE_URL

// Only pass explicit datasource override when we actually have a URL.
// This prevents build-time failures when env vars aren't injected yet (e.g. Docker build stage).
const prismaClient = new PrismaClient(
  databaseUrl
    ? {
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      }
    : undefined
)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const db = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
