import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';
import { pathToFileURL } from 'node:url';

const prisma = new PrismaClient();

export async function seedDatabase() {
  await prisma.log.deleteMany();
  await prisma.expenditure.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.user.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.base.deleteMany();

  const alpha = await prisma.base.create({ data: { name: 'Alpha Base', location: 'North Sector' } });
  const bravo = await prisma.base.create({ data: { name: 'Bravo Base', location: 'East Sector' } });
  const logistics = await prisma.base.create({ data: { name: 'Logistics Hub', location: 'Central Command' } });

  const rifle = await prisma.equipment.create({ data: { name: 'Assault Rifle', type: 'Weapon' } });
  const vehicle = await prisma.equipment.create({ data: { name: 'Armored Vehicle', type: 'Vehicle' } });
  const drone = await prisma.equipment.create({ data: { name: 'Recon Drone', type: 'Drone' } });

  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@mil.com',
      password,
      role: Role.ADMIN,
    },
  });

  const commander = await prisma.user.create({
    data: {
      name: 'Base Commander',
      email: 'commander@mil.com',
      password,
      role: Role.BASE_COMMANDER,
      baseId: alpha.id,
    },
  });

  const logisticsOfficer = await prisma.user.create({
    data: {
      name: 'Logistics Officer',
      email: 'logistics@mil.com',
      password,
      role: Role.LOGISTICS_OFFICER,
      baseId: logistics.id,
    },
  });

  await prisma.purchase.createMany({
    data: [
      { equipmentId: rifle.id, quantity: 120, baseId: alpha.id, date: new Date('2026-04-01T08:00:00Z'), createdById: logisticsOfficer.id },
      { equipmentId: vehicle.id, quantity: 8, baseId: logistics.id, date: new Date('2026-04-02T09:30:00Z'), createdById: admin.id },
      { equipmentId: drone.id, quantity: 24, baseId: bravo.id, date: new Date('2026-04-04T11:15:00Z'), createdById: logisticsOfficer.id },
    ],
  });

  await prisma.transfer.create({
    data: {
      fromBaseId: alpha.id,
      toBaseId: bravo.id,
      equipmentId: rifle.id,
      quantity: 30,
      date: new Date('2026-04-05T14:00:00Z'),
      createdById: admin.id,
    },
  });

  await prisma.assignment.create({
    data: {
      personnelName: 'Lt. Harris',
      equipmentId: drone.id,
      quantity: 2,
      baseId: alpha.id,
      date: new Date('2026-04-06T10:45:00Z'),
      createdById: commander.id,
    },
  });

  await prisma.expenditure.create({
    data: {
      equipmentId: rifle.id,
      quantity: 5,
      baseId: alpha.id,
      date: new Date('2026-04-07T13:20:00Z'),
      createdById: commander.id,
    },
  });

  console.log('Seed complete');
}

const isDirectRun = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isDirectRun) {
  seedDatabase()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
