import { RequestHandler } from 'express';

export const siteIndexHandler: RequestHandler<unknown, string> = (_, res) =>
  res.contentType('text/html').send(indexHtml);

const indexHtml = /* HTML */ /* language=HTML */ `<!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Counter App</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
    </head>
    <body>
      <div class="container">
        <h1>Counter App</h1>

        <p>This app:</p>
        <ol>
          <li>
            Is deployed to
            <a
              href="https://fly.io/docs/reference/machines/"
              target="_blank"
              rel="noopener noreferrer"
              >Fly Machines</a
            >
          </li>
          <li>
            Uses
            <a
              href="https://github.com/fly-apps/terraform-provider-fly"
              target="_blank"
              rel="noopener noreferrer"
              >terraform for deployment</a
            >
          </li>
          <li>Uses docker hub for image storage</li>
          <li>
            Has a volume attached for a sqlite db.
            <a
              href="https://wundergraph.com/blog/wunderbase_serverless_graphql_database_on_top_of_sqlite_firecracker_and_prisma"
              target="_blank"
              rel="noopener noreferrer"
              >Learned this strategy from this post</a
            >
          </li>
          <li>
            Is setup to spin down after 10 seconds of inactivity (and despite
            this, the cold start time is only about a second)
          </li>
        </ol>

        <h2>Menu</h2>

        <ul>
          <li><a href="/counters">Counters (/counters)</a></li>
          <li>Get count /counters/:name</li>
          <li>Increment count /counters/:name/increment</li>
          <li>Decrement count /counters/:name/decrement</li>
        </ul>
      </div>
    </body>
  </html>`;
