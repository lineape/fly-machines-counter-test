
FROM node:16-alpine

# Assumes that the root of the project is the build context
ADD . /app/

WORKDIR /app

RUN yarn workspaces focus --all --production

ENV NODE_ENV production

EXPOSE 3000

CMD ["node", "packages/app/dist/main.js"]
