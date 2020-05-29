import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as throng from 'throng';
import { QueueModule } from './queue.module';
import * as Queue from 'bull';
dotenv.config();

const WORKERS = process.env.WEB_CONCURRENCY;

async function bootstrap() {
  const worker = await NestFactory.create(QueueModule);
  Logger.log('Worker ' + process.pid);
  worker.init();
}

// function bootstrap() {
//   const dependenciesQueue = new Queue('dependencies', process.env.REDIS_URL);

//   dependenciesQueue.process(
//     process.env.MAX_JOBS_NUMBER,
//     async (job: Queue.Job) => {},
//   );
// }

// throng(
//   {
//     workers: WORKERS,
//     lifetime: Infinity, // Respawn if it dies
//   },
//   bootstrap,
// );
bootstrap();
