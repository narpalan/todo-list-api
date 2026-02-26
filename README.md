# Ubistart TODO API

API RESTful para gerenciamento de tarefas (TODO) desenvolvida em Node.js com NestJS, MySQL e Prisma. Sistema com autenticação JWT, roles de usuário (USER/ADMIN) e funcionalidades completas de CRUD de tarefas.

## 📋 Descrição do Projeto

Esta aplicação permite:
- **Usuários comuns**: Criar conta, autenticar-se, gerenciar suas próprias tarefas (CRUD completo)
- **Administradores**: Visualizar todas as tarefas do sistema com filtros e paginação
- **Funcionalidades especiais**: Detecção automática de tarefas atrasadas, restrições de edição em tarefas concluídas

## 🚀 Tecnologias Utilizadas

- **Framework**: [NestJS](https://nestjs.com/) (v10+)
- **Banco de Dados**: MySQL 8
- **ORM**: [Prisma](https://www.prisma.io/) - Type-safe, migrations automáticas
- **Autenticação**: JWT (@nestjs/jwt, Passport)
- **Validação**: Zod + Pipes personalizados
- **Hash de Senha**: bcrypt
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest + Supertest
- **Containerização**: Docker + Docker Compose
- **Manipulação de Datas**: date-fns

## 📁 Estrutura do Projeto
src/
├── auth/                    # Autenticação e autorização
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/
│   └── strategies/
├── users/                   # Gestão de usuários
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── todos/                   # CRUD de tarefas (usuário)
│   ├── todos.controller.ts
│   ├── todos.service.ts
│   └── todos.module.ts
├── admin/                   # Funcionalidades administrativas
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   └── admin.module.ts
├── common/                  # Recursos compartilhados
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── pipes/
├── prisma/                  # Configuração do Prisma
│   ├── prisma.service.ts
│   └── schema.prisma
└── main.ts                  # Ponto de entrada

## 🔧 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose (opcional, mas recomendado)
- MySQL 8 (se não usar Docker)
- npm ou yarn

## 🐳 Execução com Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd ubistart-todo-api

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o .env conforme necessário (veja seção de variáveis)

3. Inicie os containers:
```bash
docker-compose up -d

4. Execute as migrations e seed do admin:
```bash
docker-compose exec app npx prisma migrate dev
docker-compose exec app npx prisma db seed