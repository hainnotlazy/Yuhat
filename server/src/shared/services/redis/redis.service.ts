import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() 
    private redis: Redis
  ) {}

  async getValue(key: string) {
    return await this.redis.get(key);
  }

  async setKey(key: string, value: string) {
    return await this.redis.set(key, value);
  }

  async removeKey(key: string) {
    return await this.redis.del(key);
  }
}
