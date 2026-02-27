import { PrismaClient } from '@prisma/client';

export async function seedTasks(prisma: PrismaClient) {
  const tasksCount = await prisma.task.count();

  if (tasksCount > 0) {
    console.log('⚡ Tarefas já existem, pulando...');
    return;
  }

  const users = await prisma.user.findMany({
    where: { role: 'USER' },
  });

  if (users.length === 0) {
    console.log('⚡ Nenhum usuário comum encontrado para criar tarefas.');
    return;
  }

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  for (const user of users) {
    const tasks = [
      {
        description: 'Estudar NestJS',
        dueDate: new Date(now.getTime() + 3 * oneDay),
        completed: false,
      },
      {
        description: 'Fazer compras',
        dueDate: new Date(now.getTime() - 1 * oneDay),
        completed: false,
      },
      {
        description: 'Pagar contas',
        dueDate: new Date(now.getTime() + 1 * oneDay),
        completed: false,
      },
      {
        description: 'Ler um livro',
        dueDate: new Date(now.getTime() - 2 * oneDay),
        completed: true,
        completedAt: new Date(now.getTime() - 1 * oneDay),
      },
    ];

    for (const task of tasks) {
      await prisma.task.create({
        data: {
          description: task.description,
          dueDate: task.dueDate,
          completed: task.completed,
          completedAt: task.completedAt,
          userId: user.id,
        },
      });
    }
  }

  console.log(`✅ Tarefas criadas para ${users.length} usuários.`);
}