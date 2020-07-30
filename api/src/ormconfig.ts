import * as dotenv from 'dotenv';
import * as path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const env = process.env.NODE_ENV || 'dev';
let config;

if (env === 'dev') {
  config = dotenv.config({
    path: path.resolve(__dirname, '..', `.env.${env}`),
  }).parsed;
} else {
  const {
    TYPEORM_HOST,
    TYPEORM_PORT,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
  } = process.env;

  config = {
    TYPEORM_HOST,
    TYPEORM_PORT,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
  };
}

const ormconfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: config.TYPEORM_HOST,
  port: Number(config.TYPEORM_PORT),
  username: config.TYPEORM_USERNAME,
  password: config.TYPEORM_PASSWORD,
  database: config.TYPEORM_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: env === 'dev',
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export = ormconfig;
