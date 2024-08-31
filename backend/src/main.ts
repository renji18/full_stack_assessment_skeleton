import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
  });
  await app.listen(8000);
}
bootstrap();
