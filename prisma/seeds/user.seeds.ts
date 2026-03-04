import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const usersCount = await prisma.user.count({ where: { role: 'USER' } });

  if (usersCount > 0) {
    console.log('⚡ Usuários comuns já existem, pulando...');
    return;
  }

  const usersToCreate = [
    { email: 'joao@email.com', password: '123456' },
    { email: 'maria@email.com', password: '123456' },
    { email: 'pedro@email.com', password: '123456' },
    { email: 'ana@email.com', password: '123456' },
    { email: 'carlos@email.com', password: '123456' },
  ];

  for (const user of usersToCreate) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        role: 'USER',
      },
    });
  }

  console.log(`✅ ${usersToCreate.length} usuários comuns criados.`);
}