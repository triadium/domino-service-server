/**
 * Redis access configuration provider for queue selector
 * @module common/queues/queue.redis.access.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */
import { Injectable } from '@nestjs/common';
import { QueueSelector } from '../bases/queue-selector.base';
import { WriteQueueSelectorConfiguration } from '../configuration/write-queue-selector.configuration.provider';
import { WriteQueueList } from '../queues/write-queue-list.provider';
import { WriteUnitConfiguration } from '../configuration/write-unit.configuration';
import { QueueSelectorRedisAccessConfiguration } from '../configuration/queue-selector.redis.access.configuration.provider';

@Injectable()
export class WriteQueueSelector extends QueueSelector {
  static provider() {
    return {
      provide: WriteQueueSelector,
      useFactory: async (
        queueList: WriteQueueList,
        configuration: WriteQueueSelectorConfiguration,
        accessConfiguration: QueueSelectorRedisAccessConfiguration,
        unitConfiguration: WriteUnitConfiguration,
      ) => {
        const queueCount = unitConfiguration.get('UNIT_QUEUE_COUNT');
        const instance = new WriteQueueSelector(queueList, configuration, accessConfiguration);
        await instance.setup(queueCount);
        return instance;
      },
      inject: [WriteQueueList, WriteQueueSelectorConfiguration, QueueSelectorRedisAccessConfiguration, WriteUnitConfiguration],
    };
  }
}
