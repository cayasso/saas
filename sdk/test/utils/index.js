import { faker } from '@faker-js/faker'
import { MongoMemoryServer } from 'mongodb-memory-server'
import createDatabase from '../../src/lib/db.js'
import createSdk from '../../src/index.js'

let mongod

export const makeDatabase = async url => {
  const config = {
    instance: {
      dbName: 'hirewise-test'
    }
  }

  mongod = await MongoMemoryServer.create(config)

  if (!url) {
    url = mongod.getUri()
  }

  return createDatabase({ mongo: url, env: 'test' })
}

export const makeEmail = () => {
  return faker.internet.exampleEmail().toLowerCase()
}

export const makeSdk = async ({ db } = {}) => {
  if (!db) {
    db = await makeDatabase()
  }

  const sdk = await createSdk({ db })

  const teardown = async () => {
    await db.dropDatabase()
    await db.close()
    if (mongod) mongod.stop()
  }

  const clearData = async col => {
    if (col) {
      const collection = await db.get(col)
      return collection.deleteMany()
    }

    return db.dropDatabase()
  }

  return { ...sdk, teardown, clearData }
}
