import type express from 'express';

export function killProcessMiddleware(duration: number): express.Handler {
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
