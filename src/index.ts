import { PrismaClient } from '@prisma/client'
import * as process from 'process'
import plimit from 'p-limit'

async function main() {
  const client = new PrismaClient()

  await client.uniqueAB.deleteMany({})
  await client.iDAB.deleteMany({})

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
        const res = await client.iDAB.create({ data: val })
        console.log(`Push ${JSON.stringify(res)}`)
      }),
    ),
  )

  console.log(`Measuring performance...`)

  // Measeure search performance.
  const repetitions = 100_000
  const start = process.hrtime.bigint()

  for (let i = 0; i < repetitions; i++) {
    const rand = values[Math.floor(Math.random() * values.length)]
    // await client.uniqueAB.findUnique({ where: { a_b: rand } })
    await client.iDAB.findUnique({ where: { a_b: rand } })
  }

  const end = process.hrtime.bigint()

  const time = (end - start) / BigInt(repetitions)
  console.log(`Time: ${time}ns`)

  // Clean up!

  await client.$disconnect()
}

if (require.main === module) {
  main()
}

// unique 1313571ns
// id     1358475ns
