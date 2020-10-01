/**
 * Redis access configuration provider for queue selector
 * @module common/queues/queue.redis.access.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */
import { Injectable } from '@nestjs/common';
import { QueueSelector } from '../bases/queue-selector.base';
import { ReadQueueSelectorConfiguration } from '../configuration/read-queue-selector.configuration.provider';
import { ReadQueueList } from '../queues/read-queue-list.provider';
import { ReadUnitConfiguration } from '../configuration/read-unit.configuration';
import { QueueSelectorRedisAccessConfiguration } from '../configuration/queue-selector.redis.access.configuration.provider';

@Injectable()
export class ReadQueueSelector extends QueueSelector {
  static provider() {
    return {
      provide: ReadQueueSelector,
      useFactory: async (
        queueList: ReadQueueList,
        configuration: ReadQueueSelectorConfiguration,
        accessConfiguration: QueueSelectorRedisAccessConfiguration,
        unitConfiguration: ReadUnitConfiguration,
      ) => {
        const queueCount = unitConfiguration.get('UNIT_QUEUE_COUNT');
        const instance = new ReadQueueSelector(queueList, configuration, accessConfiguration);
        await instance.setup(queueCount);
        return instance;
      },
      inject: [ReadQueueList, ReadQueueSelectorConfiguration, QueueSelectorRedisAccessConfiguration, ReadUnitConfiguration],
    };
  }
}
