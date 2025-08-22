const { PrismaClient } = require('@prisma/client');

let prisma =
  globalThis.__prisma || new PrismaClient({ log: ['warn', 'error'] });
if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;

module.exports = { prisma };
