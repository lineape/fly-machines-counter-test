import express from 'express';

async function main(): Promise<void> {
  const app = express();

  app.use(killProcessMiddleware(1000 * 10));

  app.get('/', (_, res) => res.send('Hello World!'));

  app.listen(3000, () =>
    console.log('Example app listening on http://127.0.0.1:3000!'),
  );
}

function killProcessMiddleware(duration: number): express.Handler {
  const createTimeout = () =>
    setTimeout(() => {
      console.log(`Killing process after timeout of ${duration}ms`);

      process.exit(0);
    }, duration);

  let timeout = createTimeout();

  return (_req, _res, next) => {
    console.log('Request Received, resetting timeout');

    clearTimeout(timeout);

    timeout = createTimeout();

    next();
  };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
