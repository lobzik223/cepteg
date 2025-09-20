import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
   
  console.log(`🚀 API ready on http://localhost:${port}`);
}
bootstrap();
