FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]