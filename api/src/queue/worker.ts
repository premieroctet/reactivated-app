import { NestFactory } from '@nestjs/core';
import { QueueModule } from './queue.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(QueueModule);
  Logger.log('Worker ' + process.pid);
  app.init();
}

bootstrap();
