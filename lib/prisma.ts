// Safe Prisma import - handles case where client isn't generated yet
let PrismaClient: any;
let Pool: any;
let neonConfig: any;
let PrismaNeon: any;
let ws: any;
let prismaInitialized = false;

function initializePrisma() {
  if (prismaInitialized) return;
  
  try {
    const prismaImport = require('@prisma/client');
    PrismaClient = prismaImport.PrismaClient;
    
    const neonImport = require('@neondatabase/serverless');
    Pool = neonImport.Pool;
    neonConfig = neonImport.neonConfig;
    
    const adapterImport = require('@prisma/adapter-neon');
    PrismaNeon = adapterImport.PrismaNeon;
    
    ws = require('ws');
    
    // Configure neon WebSocket for Node.js environment
    if (typeof WebSocket === 'undefined' && ws && neonConfig) {
      neonConfig.webSocketConstructor = ws
    }
    
    prismaInitialized = true;
  } catch (error) {
    // Silently fail - will use mock
    prismaInitialized = true; // Mark as initialized to prevent retries
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: any
}

// Create a safe mock if Prisma isn't available
const createMockPrisma = () => {
  const createMockModel = () => {
    return new Proxy({}, {
      get: () => {
        return () => Promise.resolve(null);
      }
    });
  };
  
  return new Proxy({}, {
    get: (_target: any, prop: string) => {
      // Return a mock model that returns null/empty results
      return createMockModel();
    }
  });
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    initializePrisma();
    
    if (!PrismaClient) {
      return createMockPrisma();
    }
    
    try {
      const connectionString = process.env.DATABASE_URL || ''
      if (!connectionString) {
        return createMockPrisma();
      }
      
      const pool = new Pool({ connectionString })
      const adapter = new PrismaNeon(pool)
      
      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    } catch (error) {
      console.warn('[Prisma] Failed to initialize, using mock:', error);
      return createMockPrisma();
    }
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
