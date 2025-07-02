import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription('API para cadastro de produtores(producer), propriedades(property), safras(harvest) e culturas(crops)')
    .setVersion('1.0')
    .addTag('Brain Agriculture - Teste Técnico v2')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3001/api

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
