import express from 'express';
import { createCountersRouter } from './routes/counters';
import knex, { type Knex } from 'knex';
import { killProcessMiddleware } from './middleware/kill-process';
import { siteIndexHandler } from './routes/site-index';
import morgan from 'morgan';

async function main(): Promise<void> {
  console.log('Creating server instance...');
  const app = express();

  console.log('Creating database connection...');
  const db = createDbConnection();

  if (process.env.DISABLE_KILL_PROCESS !== 'true') {
    console.log('Adding kill process middleware...');
    app.use(killProcessMiddleware(1000 * 10));
  } else {
    console.log('Kill process middleware disabled.');
  }

  app.use(morgan('dev'));

  console.log('Creating counters router...');
  app.use('/counters', await createCountersRouter(db));
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
