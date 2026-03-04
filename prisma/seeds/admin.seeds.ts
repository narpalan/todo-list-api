import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(prisma: PrismaClient) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ubistart.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Administrador criado: ${adminEmail}`);
    console.log('Executando próxima seed...');
  } else {
    console.log('⚡ Administrador já existe, executando próxima seed...');
  }
}