import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Prisma 7: Requires adapter for direct PostgreSQL connection
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
  
  if (!connectionString) {
    throw new Error('DATABASE_URL or DIRECT_URL must be set')
  }

  // Parse connection string manually to handle SSL properly
  // Format: postgresql://user:password@host:port/database
  const match = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+?)(\?.*)?$/)
  
  let pool: Pool;
  
  if (match) {
    const [, user, password, host, port, database] = match
    pool = new Pool({
      host,
      port: parseInt(port),
      database,
      user: decodeURIComponent(user),
      password: decodeURIComponent(password),
      ssl: {
        rejectUnauthorized: false // Supabase uses self-signed certs
      }
    })
  } else {
    // Fallback to connectionString if parsing fails
    pool = new Pool({ 
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    })
  }
  
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma
export { prisma }

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
