/**
 * Configuration provider for queues
 * @module common/queue/queue.configuration.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import { Injectable } from '@nestjs/common';
import { QueueList } from '../bases/queue-list.base';
import { QueueConfiguration } from '../configuration/queue.configuration.provider';
import { WriteUnitConfiguration } from '../configuration/write-unit.configuration';

@Injectable()
export class WriteQueueList extends QueueList {
  static provider() {
    return {
      provide: WriteQueueList,
      useFactory: async (unitConfiguration: WriteUnitConfiguration, queueConfiguration: QueueConfiguration) => {
        const queuePrefix = unitConfiguration.get('UNIT_QUEUE_PREFIX');
        const queueCount = unitConfiguration.get('UNIT_QUEUE_COUNT');
        const instance = new WriteQueueList(queueConfiguration);
        await instance.setup(queueCount, queuePrefix);
        return instance;
      },
      inject: [WriteUnitConfiguration, QueueConfiguration],
    };
  }
}