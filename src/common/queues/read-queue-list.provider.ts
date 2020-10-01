/**
 * Configuration provider for queues
 * @module common/queue/queue.configuration.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import { Injectable } from '@nestjs/common';
import { QueueList } from '../bases/queue-list.base';
import { ReadUnitConfiguration } from '../configuration/read-unit.configuration';
import { QueueConfiguration } from '../configuration/queue.configuration.provider';

@Injectable()
export class ReadQueueList extends QueueList {
  static provider() {
    return {
      provide: ReadQueueList,
      useFactory: async (unitConfiguration: ReadUnitConfiguration, queueConfiguration: QueueConfiguration) => {
        const queuePrefix = unitConfiguration.get('UNIT_QUEUE_PREFIX');
        const queueCount = unitConfiguration.get('UNIT_QUEUE_COUNT');
        const instance = new ReadQueueList(queueConfiguration);
        await instance.setup(queueCount, queuePrefix);
        return instance;
      },
      inject: [ReadUnitConfiguration, QueueConfiguration],
    };
  }
}
