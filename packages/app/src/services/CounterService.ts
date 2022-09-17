import type { Knex } from 'knex';

export type Counter = {
  name: string;
  count: number;
};

export class CounterService {
  constructor(private db: Knex) {}

  getAll(limit: number, offset = 0): Promise<Counter[]> {
    return this.db('counters')
      .select<Counter[]>(['name', 'count'])
      .limit(limit)
      .offset(offset);
  }

  getByName(name: string): Promise<Counter | undefined> {
    return getCounter(this.db, name);
  }

  async increment(name: string, amount: number): Promise<Counter> {
    return this.db.transaction(async (trx) => {
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
  }

  async ensureCounterTableExists(): Promise<void> {
    const hasTable = await this.db.schema.hasTable('counters');
    if (hasTable) return;

    await this.db.schema.createTable('counters', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.integer('count').notNullable();
    });
  }
}

const getCounter = (db: Knex, name: string): Promise<Counter | undefined> =>
  db('counters').select<Counter[]>(['name', 'count']).where({ name }).first();
