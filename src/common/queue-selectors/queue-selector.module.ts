/**
 * Module for queue selector
 * @module common/queue-selectors/queue-selector.module
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 *
 * @description
 * Declares configuration providers for the web server
 * Reads configuration files with name like <NODE_ENV>.<name>.env
 * Names: web,...
 */

import { Module } from '@nestjs/common';
import { ReadQueueSelector } from './read-queue-selector.provider';
import { WriteQueueSelector } from './write-queue-selector.provider.1';
import { QueueModule } from '../queues/queue.module';
import { QueueSelectorConfigurationModule } from '../configuration/queue-selector.configuration.module';
import { UnitConfigurationModule } from '../configuration/unit.configuration.module';

@Module({
  imports: [QueueModule, QueueSelectorConfigurationModule, UnitConfigurationModule],
  providers: [ReadQueueSelector.provider(), WriteQueueSelector.provider()],
  exports: [ReadQueueSelector, WriteQueueSelector],
})
export class QueueSelectorModule {}