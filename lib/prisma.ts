import { PrismaClient } from '@prisma/client'

// Déclaration du client Prisma global pour éviter les connexions multiples
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// Création ou réutilisation d'une instance existante
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
})

// En développement, on garde l'instance en global
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma