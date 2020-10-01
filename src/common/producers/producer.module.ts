/**
 * Configuration module for queues
 * @module common/queues/queue.configuration.module
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import { Module } from '@nestjs/common';
import { QueueConfigurationModule } from '../configuration/queue.configuration.module';
import { QueueSelectorModule } from '../queue-selectors/queue-selector.module';
import { ReadProducer } from './read-producer.provider';
import { WriteProducer } from './write-producer.provider';

@Module({
  imports: [QueueConfigurationModule, QueueSelectorModule],
  providers: [ReadProducer, WriteProducer],
  exports: [ReadProducer, WriteProducer],
})
export class ProducerModule {}