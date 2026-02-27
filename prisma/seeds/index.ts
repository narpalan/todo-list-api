import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { seedAdmin } from './admin.seeds';
import { seedUsers } from './user.seeds';
import { seedTasks } from './task.seeds';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeds...');

  if (process.env.RUN_SEEDS !== 'true') {
    console.log('Seeds desativados (RUN_SEEDS não é true). Pulando...');
    return;
  }

  await seedAdmin(prisma);
  await seedUsers(prisma);
  await seedTasks(prisma);

  console.log('🌱 Seeds concluídos!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });