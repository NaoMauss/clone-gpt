# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

RUN npx prisma generate

# Run Prisma migrations
RUN npx prisma migrate deploy

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]