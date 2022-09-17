import { Router } from 'express';
import type { Knex } from 'knex';

type Counter = { name: string; count: number };

type ParamName = { name: string };
type QSAmount = { amount?: string | string[] };

type RespError = { error: string };
type RespHasCounter = { counter: Counter };
type RespHasCounters = { counters: Counter[] };

export async function createCountersRouter(db: Knex): Promise<Router> {
  const router = Router();

  console.log('Ensuring counters table exists...');
  await ensureCounterTableExists(db);

  router.get<unknown, RespHasCounters | RespError>('/', async (_req, res) => {
    try {
      res.json({ counters: await getCounters(db, 50) });
    } catch (e) {
      console.error(e);

      const error = e instanceof Error ? e.message : String(e);
      res.status(500).json({ error });
    }
  });

  router.get<ParamName, RespHasCounter | RespError, QSAmount>(
    '/:name',
    async (req, res) => {
      try {
        const counter = await getCounter(db, req.params.name);
        if (!counter) {
          return res.status(404).json({ error: 'Not Found' });
        }

        res.json({ counter });
      } catch (e) {
        console.error(e);

        const error = e instanceof Error ? e.message : String(e);
        res.status(500).json({ error });
      }
    },
  );

  router.get<ParamName, RespHasCounter | RespError, QSAmount>(
    '/:name/increment',
    async ({ params, query }, res) => {
      const amount = Math.abs(parseInt(String(query.amount), 10) || 1);
      try {
        res.json({ counter: await incrementCounter(db, params.name, amount) });
      } catch (e) {
        console.error(e);

        const error = e instanceof Error ? e.message : String(e);
        res.status(500).json({ error });
      }
    },
  );

  router.get<ParamName, RespHasCounter | RespError>(
    '/:name/decrement',
    async ({ params, query }, res) => {
      const amount = Math.abs(parseInt(String(query.amount), 10) || 1);
      try {
        res.json({ counter: await incrementCounter(db, params.name, -amount) });
      } catch (e) {
        console.error(e);

        const error = e instanceof Error ? e.message : String(e);
        res.status(500).json({ error });
      }
    },
  );

  return router;
}

async function ensureCounterTableExists(db: Knex) {
  const hasTable = await db.schema.hasTable('counters');
  if (hasTable) return;

  await db.schema.createTable('counters', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.integer('count').notNullable();
  });
}

const getCounters = (db: Knex, limit: number, offset = 0) =>
  db('counters')
    .select<Counter[]>(['name', 'count'])
    .limit(limit)
    .offset(offset);

const getCounter = (db: Knex, name: string): Promise<Counter | undefined> =>
  db('counters').select<Counter[]>(['name', 'count']).where({ name }).first();

const incrementCounter = async (
  db: Knex,
  name: string,
  amount: number,
): Promise<Counter> =>
  db.transaction(async (trx) => {
    const counter = await getCounter(trx, name);
    if (!counter) {
      // Create the counter if it doesn't exist.
      const [created] = await trx('counters')
        .insert({ name, count: amount })
        .returning<Counter[]>(['name', 'count']);

      if (!created) throw new Error('Failed to create counter');

      return created;
    }

    // Update the counter if it does exist.
    const [updated] = await trx('counters')
      .increment('count', amount)
      .where({ name })
      .returning<Counter[]>(['name', 'count']);

    return updated || counter; // this is here for type safety. updated will exist at runtime
  });
