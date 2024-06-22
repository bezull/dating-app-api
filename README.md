# Dating App API

A backend API for Dating Application.

# Services

## Working

### Users Module

1. Sign In
2. Sign Up

## Future And Work In Progress

### Matches Module

1. Discover dating profiles
2. Like & Pass dating profiles

### Subscription Module

1. Purchase subscription
2. Subscription perks

# Running Service

Running the service can be done in native or docker enviroment by leveraging docker compose.

## Native

To run in native mode, make sure to install npm packages by running command

> npm run dev

Then, make sure to copy ".env.example" file to ".env". Adjust the values such as SQL database connection. To run the service, use command

> npm run dev

The service will run and can be accessed via port :3000 or based on configured port env file

## Docker

To run in docker environment, make sure is docker installed first then run command

> docker compose -f "docker_compose.dev.yml" up -d --build

This will create an all in one environtment consisting of the App itself and a MySQL service. The app can be accessed via port :3000

# API Endpoints

API routes are available in postman file "Dating App.postman_collection.json"

# Tests

## Working Unit Testing

Unit tests are created in \*.spec.ts files. To run it, use command

> npm run test:unit

1. Domain user
2. Auth service
3. Hashing password

## Working Infra Testing

Unit tests are created in \*.infra.ts files. To run it, use command

> npm run test:infra

1. User repository infra test

## End-to-End Testing

Unit tests are created in \*.e2e.ts files. To run it, use command

> npm run test:e2e

1. Sign in feature end-to-end testing
2. Sign up feature end-to-end testing

# Add-on

1. Lint are available using eslint and can be run using command
   > npm run lint
2. Prettier are available and configured to editor. Can be run using command
   > npm run prettier
