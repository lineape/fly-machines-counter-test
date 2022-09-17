import type { Knex } from 'knex';

export type Counter = {
  name: string;
  count: number;
};

export class CounterService {
  constructor(private db: Knex, private tableName = 'counters') {}

  getAll(limit: number, offset = 0): Promise<Counter[]> {
    return this.db(this.tableName)
      .select<Counter[]>(['name', 'count'])
      .limit(limit)
      .offset(offset);
  }

  async getByName(name: string): Promise<Counter> {
    const counter = await getCounter(this.db, this.tableName, name);

    return counter || { name, count: 0 };
  }

  async increment(name: string, amount: number): Promise<Counter> {
    return this.db.transaction(async (trx) => {
      const counter = await getCounter(trx, this.tableName, name);
      if (!counter) {
        // Create the counter if it doesn't exist.
        const [created] = await trx(this.tableName)
          .insert({ name, count: amount })
          .returning<Counter[]>(['name', 'count']);

        if (!created) throw new Error('Failed to create counter');

        return created;
      }

      // Update the counter if it does exist.
      const [updated] = await trx(this.tableName)
        .increment('count', amount)
        .where({ name })
        .returning<Counter[]>(['name', 'count']);

      return updated || counter; // this is here for type safety. updated will exist at runtime
    });
  }

  resetByName(name: string): Promise<unknown> {
    return this.db(this.tableName).delete().where({ name });
  }

  resetAll(): Promise<unknown> {
    return this.db(this.tableName).delete();
  }

  async migrateIfNeeded(): Promise<void> {
    if (await this.db.schema.hasTable(this.tableName)) return;

    await this.db.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.integer('count').notNullable();
    });
  }
}

const getCounter = (
  db: Knex,
  tableName: string,
  name: string,
): Promise<Counter | undefined> =>
  db(tableName).select<Counter[]>(['name', 'count']).where({ name }).first();
