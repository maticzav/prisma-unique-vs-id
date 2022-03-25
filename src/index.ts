import { PrismaClient } from '@prisma/client'
import * as process from 'process'
import plimit from 'p-limit'

async function main() {
  const client = new PrismaClient()

  await client.uniqueAB.deleteMany({})
  await client.iDAB.deleteMany({})
  await client.regularAB.deleteMany({})

  console.log(`Filling...`)

  const values: { a: string; b: string }[] = []

  const limit = plimit(100)

  // Fill the database with mock values.
  for (let i = 0; i < 100_000; i++) {
    const a = Math.floor(Math.random() * 1_000_000_000).toString()
    const b = Math.floor(Math.random() * 1_000_000_000).toString()

    values.push({ a, b })
  }

  await Promise.all(
    values.map((val) =>
      limit(async () => {
        // const res = await client.uniqueAB.create({ data: val })
        const ress = await Promise.all([
          client.iDAB.create({ data: val }),
          client.uniqueAB.create({ data: val }),
          client.regularAB.create({ data: val }),
        ])
        console.log(`Push ${JSON.stringify(ress)}`)
      }),
    ),
  )

  console.log(`Measuring performance...`)

  // Measeure search performance.
  const repetitions = 100_000

  console.log(`Regular search...`)

  const regular = await benchmark(repetitions, async () => {
    const rand = values[Math.floor(Math.random() * values.length)]
    await client.regularAB.findFirst({ where: rand })
  })

  console.log(`Unique search...`)

  const unique = await benchmark(repetitions, async () => {
    const rand = values[Math.floor(Math.random() * values.length)]
    await client.uniqueAB.findUnique({ where: { a_b: rand } })
  })

  console.log(`ID search...`)

  const identifier = await benchmark(repetitions, async () => {
    const rand = values[Math.floor(Math.random() * values.length)]
    await client.iDAB.findUnique({ where: { a_b: rand } })
  })

  console.log(`Repetitions: ${repetitions}`)
  console.log(`Regular: ${regular}ns`)
  console.log(`Unique: ${unique}ns`)
  console.log(`Identifier: ${identifier}ns`)

  // Clean up!

  await client.$disconnect()
}

if (require.main === module) {
  main()
}

// unique 1313571ns
// id     1358475ns

/**
 * Measures performance of a function with a given number of repetitions.
 */
async function benchmark(
  reps: number,
  f: (i: number) => Promise<void>,
): Promise<BigInt> {
  const start = process.hrtime.bigint()

  for (let i = 0; i < reps; i++) {
    await f(i)
  }

  const end = process.hrtime.bigint()
  const time = (end - start) / BigInt(reps)
  return time
}
