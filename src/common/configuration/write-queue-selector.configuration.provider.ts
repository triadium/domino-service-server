/**
 * Redis access configuration provider for queue selector
 * @module common/queues/queue.redis.access.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */
import { Injectable } from '@nestjs/common';
import { QueueSelectorConfiguration } from '../bases/queue-selector.configuration.base';

@Injectable()
export class WriteQueueSelectorConfiguration extends QueueSelectorConfiguration {
  constructor(){
    super('write-queue-selector');
  }
}