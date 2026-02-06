import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import "dotenv/config";
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  console.log('Database URL:', process.env.DATABASE_URL);

  const uploadsPath = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsPath)) {
    try {
      mkdirSync(uploadsPath, { recursive: true });
      console.log('Created uploads directory at', uploadsPath);
    } catch (err) {
      console.warn('Could not create uploads directory', err);
    }
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  const config = new DocumentBuilder()
  .setTitle('Error Library')
  .setDescription('Mi biblioteca personal de errores')
  .setVersion('1.0')
  .build()

const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('api', app, document)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
