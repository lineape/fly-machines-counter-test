import express from 'express';
import knex, { type Knex } from 'knex';
import morgan from 'morgan';

import { killProcessMiddleware } from './middleware/kill-process';
import { createCountersRouter } from './routes/counters';
import { siteIndexHandler } from './routes/site-index';
import { CounterService } from './services/CounterService';

async function main(): Promise<void> {
  console.log('Creating database connection...');
  const db = createDbConnection();
  const service = new CounterService(db);

  console.log('Ensuring counters table exists...');
  await service.ensureCounterTableExists();

  console.log('Creating server instance...');
  const app = express();

  console.log('Creating middleware...');
  app.use(morgan('dev'));
  if (process.env.DISABLE_KILL_PROCESS !== 'true') {
    console.log('Adding kill process middleware...');
    app.use(killProcessMiddleware(1000 * 10));
  } else {
    console.log('Kill process middleware disabled.');
  }

  console.log('Creating routes...');
  app.use('/counters', createCountersRouter(service));
  app.get('/', siteIndexHandler);

  console.log('Starting server...');
  app.listen(3000, () =>
    console.log('Example app listening on http://127.0.0.1:3000!'),
  );
}

function createDbConnection(): Knex {
  const SQLITE_DB_FILENAME = process.env.SQLITE_DB_FILENAME || './dev.sqlite3';

  return knex({
    client: 'better-sqlite3',
    connection: { filename: SQLITE_DB_FILENAME },
    useNullAsDefault: true,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
