import { Redis } from '@upstash/redis'

// Lazily initialize Redis to avoid build-time warnings when env vars are absent.
const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

let client: Redis | undefined
if (url && token) {
  client = new Redis({ url, token })
}

type RedisLike = {
  get: (...args: any[]) => Promise<any>
  set: (...args: any[]) => Promise<any>
  del: (...args: any[]) => Promise<any>
  keys: (...args: any[]) => Promise<any>
}

const missingEnvStub: RedisLike = {
  async get() {
    throw new Error('Redis not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
  },
  async set() {
    throw new Error('Redis not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
  },
  async del() {
    throw new Error('Redis not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
  },
  async keys() {
    throw new Error('Redis not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
  },
}

export const redisdb = (client ?? (missingEnvStub as unknown as Redis))
