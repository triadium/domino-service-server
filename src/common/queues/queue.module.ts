/**
 * Configuration module for queues
 * @module common/queues/queue.configuration.module
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 *
 * @description
 * Declares configuration providers for the web server
 * Reads configuration files with name like <NODE_ENV>.<name>.env
 * Names: web,...
 */

import { Module } from '@nestjs/common';
import { ReadQueueList } from './read-queue-list.provider';
import { WriteQueueList } from './write-queue-list.provider';
import { QueueConfigurationModule } from '../configuration/queue.configuration.module';
import { UnitConfigurationModule } from '../configuration/unit.configuration.module';

@Module({
  imports: [QueueConfigurationModule, UnitConfigurationModule],
  providers: [ReadQueueList.provider(), WriteQueueList.provider()],
  exports: [ReadQueueList, WriteQueueList],
})
export class QueueModule {}