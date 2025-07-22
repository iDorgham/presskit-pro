import Redis from 'ioredis';
import { redisConfig, cacheConfig } from '../config';
import { logger } from '../middleware/logger';

// Create Redis client
const redis = new Redis(redisConfig.url, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Handle Redis events
redis.on('error', (error) => {
  logger.error('Redis error:', error);
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('ready', () => {
  logger.info('Redis ready');
});

// Cache middleware
export const cache = {
  // Set cache
  set: async (key: string, value: any, ttl: number = cacheConfig.ttl): Promise<void> => {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await redis.setex(`${redisConfig.prefix}${key}`, ttl, serializedValue);
      } else {
        await redis.set(`${redisConfig.prefix}${key}`, serializedValue);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  },

  // Get cache
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await redis.get(`${redisConfig.prefix}${key}`);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  // Delete cache
  del: async (key: string): Promise<void> => {
    try {
      await redis.del(`${redisConfig.prefix}${key}`);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  },

  // Clear cache by pattern
  clear: async (pattern: string): Promise<void> => {
    try {
      const keys = await redis.keys(`${redisConfig.prefix}${pattern}`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  },

  // Check if key exists
  exists: async (key: string): Promise<boolean> => {
    try {
      const exists = await redis.exists(`${redisConfig.prefix}${key}`);
      return exists === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  },

  // Set cache with hash
  hset: async (hash: string, key: string, value: any): Promise<void> => {
    try {
      const serializedValue = JSON.stringify(value);
      await redis.hset(`${redisConfig.prefix}${hash}`, key, serializedValue);
    } catch (error) {
      logger.error('Cache hset error:', error);
    }
  },

  // Get cache from hash
  hget: async <T>(hash: string, key: string): Promise<T | null> => {
    try {
      const value = await redis.hget(`${redisConfig.prefix}${hash}`, key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache hget error:', error);
      return null;
    }
  },

  // Delete cache from hash
  hdel: async (hash: string, key: string): Promise<void> => {
    try {
      await redis.hdel(`${redisConfig.prefix}${hash}`, key);
    } catch (error) {
      logger.error('Cache hdel error:', error);
    }
  },

  // Get all cache from hash
  hgetall: async <T>(hash: string): Promise<{ [key: string]: T } | null> => {
    try {
      const values = await redis.hgetall(`${redisConfig.prefix}${hash}`);
      if (!values) return null;

      const result: { [key: string]: T } = {};
      for (const [key, value] of Object.entries(values)) {
        result[key] = JSON.parse(value) as T;
      }
      return result;
    } catch (error) {
      logger.error('Cache hgetall error:', error);
      return null;
    }
  },

  // Increment value
  incr: async (key: string): Promise<number> => {
    try {
      return await redis.incr(`${redisConfig.prefix}${key}`);
    } catch (error) {
      logger.error('Cache incr error:', error);
      return 0;
    }
  },

  // Decrement value
  decr: async (key: string): Promise<number> => {
    try {
      return await redis.decr(`${redisConfig.prefix}${key}`);
    } catch (error) {
      logger.error('Cache decr error:', error);
      return 0;
    }
  }
};

// Export Redis client for direct access if needed
export { redis };