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
- **Validação**: class-validator + class-transformer
- **Hash de Senha**: bcrypt
- **Documentação**: Swagger/OpenAPI (@nestjs/swagger)
- **Testes**: Jest + Supertest
- **Containerização**: Docker + Docker Compose

## 📁 Estrutura do Projeto
```text
src/
│   ├── decorators/             
│   ├── filters/│      
│   ├── modules/
│       ├── auth/                    # Cadastro, autenticação e autorização
│           ├── dto/
│           ├── guards/               
│           ├── strategies/
│           ├── auth.controller.ts
│           ├── auth.service.ts
│           └── auth.module.ts           
│       ├── admin/                   # Gestão de usuários e tarefas
│           ├── dto/
│           ├── admin.controller.ts
│           ├── admin.service.ts
│           └── admin.module.ts
│       ├── tasks/                   # CRUD de tarefas (usuário)
│           ├── dto/
│           ├── tasks.controller.ts
│           ├── tasks.service.ts
│           └── tasks.module.ts
│        ├── prisma/                  # Configuração do Prisma
│           ├── prisma.service.ts
│           └── schema.prisma
└── main.ts                  # Ponto de entrada
```

## 🔧 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose (recomendado) ou MySQL 8 instalado localmente
- npm ou yarn

## ⚙️ Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# MySQL (para execução local)
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=

# Para Docker (dentro do container, o host é o nome do serviço)
# DB_HOST=mysql
# DB_PORT=3306

# URL de conexão do Prisma (usada nas migrations)
DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"

# JWT
JWT_SECRET=

# Seeds
RUN_SEEDS=true
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Swagger
ACTIVATE_SWAGGER=YES

```

## 🐳 Execução com Docker (Recomendado)

Siga os passos abaixo para instalar e rodar o projeto localmente utilizando o docker:

0. Clone o repositório:
```bash
    git clone git@github.com:narpalan/todo-list-api.git
    cd ubistart-todo-api
```
1. Configure as variáveis de ambiente (copie .env.example para .env e ajuste se necessário).
2. Inicie os containers:
```bash
   docker-compose up -d
```
3. A aplicação estará disponível em http://localhost:3000.
  
## 💻 Execução sem Docker 

Siga os passos abaixo para instalar e rodar o projeto localmente sem o docker:

0. Clone o repositório:
```bash
    git clone git@github.com:narpalan/todo-list-api.git
    cd ubistart-todo-api
```
1. Instale as dependências:
```bash
    npm install
```
2. Configure o arquivo .env conforme explicado acima, garantindo que as variáveis apontem para seu MySQL local.
3. Execute as migrações do Prisma. Este comando criará o banco de dados (se não existir) e aplicará todas as migrations:
```bash
    npx prisma migrate dev
```
4. Popule o banco com dados iniciais (administrador e usuários de exemplo):

5. Inicie a aplicação
```bash
    npm run start:dev
    ou
    npm run start
```
6. A aplicação estará disponível em http://localhost:3000.

## 📚 Documentação da API (Swagger) 

Com a aplicação rodando, acesse:
```text
    http://localhost:3000/docs
```
Lá você encontrará todos os endpoints documentados e poderá testá-los interativamente.

## 🧪 Testes

### Testes Unitários
```bash    
    npm run test
``` 