#!/bin/sh

echo "Waitin for postgres to start..."

while ! nc -z celebration_campaign_postgres 5432; do
  sleep 0.1
done

echo "Postgres started"

npm run db:create:dev
npm run db:migrate
npm run db:seed
npm run start:dev