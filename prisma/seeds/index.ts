import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { seedAdmin } from './admin.seeds';
import { seedUsers } from './user.seeds';
import { seedTasks } from './task.seeds';

async function main() {
  console.log('🌱 Iniciando seeds com contexto da aplicação...');

  const app = await NestFactory.createApplicationContext(AppModule);

  const prisma = app.get(PrismaService);

  try {
    if (process.env.RUN_SEEDS !== 'true') {
      console.log('Seeds desativados (RUN_SEEDS não é true). Pulando...');
      return;
    }

    await seedAdmin(prisma);
    await seedUsers(prisma);
    await seedTasks(prisma);

    console.log('🌱 Seeds concluídos!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});