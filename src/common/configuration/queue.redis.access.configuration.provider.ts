/**
 * Redis access configuration provider for queue
 * @module common/queues/queue.redis.access.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */
import { Injectable } from '@nestjs/common';
import { RedisAccessConfiguration } from './redis.access.configuration.provider';

@Injectable()
export class QueueRedisAccessConfiguration extends RedisAccessConfiguration {
  constructor(){
    super('queue.redis.access');
  }
}