import express from 'express';

async function main(): Promise<void> {
  const app = express();

  app.get('/', (_, res) => res.send('Hello World!'));

  app.listen(3000, () =>
    console.log('Example app listening on http://127.0.0.1:3000!'),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
