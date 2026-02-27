import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {  
  constructor(private configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.get<string>('DB_HOST'),
      user: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      port: configService.get<number>('DB_PORT'), 
      allowPublicKeyRetrieval: true,
      ssl: false,     
    });    

    super({adapter})
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}