import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.NODE_ENV === 'test'
    ? process.env.DATABASE_TEST_URL
    : process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL or DATABASE_TEST_URL must be set')
}

const prismaClient = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const db = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db