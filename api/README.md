## Installation

```bash
$ npm install
```

```bash
cp .env.dist .env.dev
```

## Running the app

### Without docker

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

### With Docker

Update your `.env` file for the following keys:

```
TYPEORM_HOST=mysql
TYPEORM_USERNAME=admin
TYPEORM_PASSWORD=password
TYPEORM_DATABASE=reactivated
```

Then

```bash
# Run with --build for the first run
docker-compose up --build
```

[http://localhost:3000](http://localhost:3000)
[http://localhost:3000/swagger](http://localhost:3000/swagger)

## Hooks

```bash
smee --url https://smee.io/BVk7Sqmgj7fXXcV --path /webhooks/consume --port 3000
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
