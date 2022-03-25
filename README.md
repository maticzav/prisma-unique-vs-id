# prisma-id-unique-test

### Results

Show average time for each execution of 100_000 repetitions.

```
Repetitions: 100000
Regular: 3631550ns
Unique: 1183782ns
Identifier: 1504516ns
```

### Running Locally

```bash
docker-compose up -d
export DATABASE_URL="postgresql://prisma:prisma@localhost:5432/test"

yarn prisma migrate deploy
yarn ts-node src/index.ts
```
