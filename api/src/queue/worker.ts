import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as throng from 'throng';
import { WorkerModule } from './worker.module';
dotenv.config();

const WORKERS = Number(process.env.WEB_CONCURRENCY);

async function bootstrap() {
  const worker = await NestFactory.create(WorkerModule);
  Logger.log('Worker ' + process.pid);
  worker.init();
}

throng({
  workers: WORKERS,
  lifetime: Infinity, // Respawn worker if it dies
  start: bootstrap,
});

// bootstrap();
