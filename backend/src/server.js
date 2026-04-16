import 'dotenv/config';
import app from './app.js';
import { prisma } from './lib/prisma.js';
import { seedDatabase } from '../prisma/seed.js';

const port = process.env.PORT || 4000;

async function startServer() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    console.log('No users found. Seeding demo data...');
    await seedDatabase();
  }

  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
