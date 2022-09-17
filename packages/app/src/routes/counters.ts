import { type Response, Router } from 'express';

import type { CounterService } from '../services/CounterService';

type Counter = { name: string; count: number };

type ParamName = { name: string };
type QSAmount = { amount?: string | string[] };

type RespError = { error: string };
type RespHasCounter = { counter: Counter };
type RespHasCounters = { counters: Counter[] };

export function createCountersRouter(service: CounterService): Router {
  const router = Router();

  router.get<unknown, RespHasCounters | RespError>('/', async (_req, res) => {
    try {
      res.json({ counters: await service.getAll(50) });
    } catch (e) {
      console.error(e);

      const error = e instanceof Error ? e.message : String(e);
      res.status(500).json({ error });
    }
  });

  router.get('/reset', async (_, res) => {
    try {
      await service.resetAll();
      res.status(200).send("Reset all counters. You're welcome.");
    } catch (e) {
      handleError(res, e);
    }
  });

  router.get<ParamName>('/:name/reset', async (req, res) => {
    try {
      await service.resetByName(req.params.name);
      res.status(200).send(`Reset counter ${req.params.name}. You're welcome.`);
    } catch (e) {
      handleError(res, e);
    }
  });

  router.get<ParamName, RespHasCounter | RespError, QSAmount>(
    '/:name',
    async (req, res) => {
      try {
        const counter = await service.getByName(req.params.name);

        return counter
          ? res.json({ counter })
          : res.status(404).json({ error: 'Not Found' });
      } catch (e) {
        handleError(res, e);
      }
    },
  );

  router.get<ParamName, RespHasCounter | RespError, QSAmount>(
    '/:name/increment',
    async ({ params, query }, res) => {
      const amount = Math.abs(parseInt(String(query.amount), 10) || 1);
      const name = params.name;

      try {
        res.json({ counter: await service.increment(name, amount) });
      } catch (e) {
        handleError(res, e);
      }
    },
  );

  router.get<ParamName, RespHasCounter | RespError>(
    '/:name/decrement',
    async ({ params, query }, res) => {
      const amount = Math.abs(parseInt(String(query.amount), 10) || 1);
      const name = params.name;

      try {
        res.json({ counter: await service.increment(name, -amount) });
      } catch (e) {
        handleError(res, e);
      }
    },
  );

  return router;
}

function handleError(res: Response, e: unknown) {
  console.error(e);

  const error = e instanceof Error ? e.message : String(e);
  res.status(500).json({ error });
}
