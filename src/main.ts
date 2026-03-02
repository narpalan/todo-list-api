import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  const activateSwagger = configService.get<string>('ACTIVATE_SWAGGER');
  if (activateSwagger === 'YES') {
    const config = new DocumentBuilder()
      .setTitle('Ubistart TODO list API')
      .setDescription('API para gerenciamento de tarefas com autenticação JWT')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<string>('PORT');
  await app.listen(port ?? 3000);
}
bootstrap();
