import type { RequestHandler } from 'express';

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
      <div class="container py-3">
        <h1>Counter App</h1>

        <div class="alert alert-primary">
          <p class="mb-1"><strong>This api</strong></p>
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

          <p class="mb-0">
            <a href="https://github.com/lineape/fly-machines-counter-test"
              >Here's a link to GitHub repo</a
            >
          </p>
        </div>

        <h2>Api</h2>
        <table class="table table-striped">
          <tr>
            <td>List Counters</td>
            <td><a href="/counters">/counters</a></td>
          </tr>
          <tr>
            <td>Get :name Count</td>
            <td><a href="/counters/counter-1">/counters/:name</a></td>
          </tr>
          <tr>
            <td>Increment :name Counter</td>
            <td>
              <a href="/counters/counter-1/increment?amount=1"
                >/counters/:name/increment?amount=1</a
              >
            </td>
          </tr>
          <tr>
            <td>Decrement :name Counter</td>
            <td>
              <a href="/counters/counter-1/decrement?amount=1"
                >/counters/:name/decrement?amount=1</a
              >
            </td>
          </tr>
          <tr>
            <td>Reset :name Counter</td>
            <td>
              <a href="/counters/counter-1/reset">/counters/:name/reset</a>
            </td>
          </tr>
          <tr>
            <td>Reset All Counters</td>
            <td><a href="/counters/reset">/counters/reset</a></td>
          </tr>
        </table>
      </div>
    </body>
  </html>`;
