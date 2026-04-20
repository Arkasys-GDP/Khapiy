import 'dotenv/config';
import { PrismaService } from '../src/prisma/prisma.service';

async function main() {
  const prisma = new PrismaService();
  await prisma.$connect();
  try {
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
    console.log("pgvector extension enabled successfully!");
  } catch (e) {
    console.error("error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
