import { Config } from '@dddforum/config';
import { PrismaDatabase } from '@dddforum/database';

const config = Config();
const database = new PrismaDatabase(config);
const prisma = database.getConnection();

async function main() {
  console.log('Starting database reset...');
  
  // Delete all records from all tables
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error while resetting database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
