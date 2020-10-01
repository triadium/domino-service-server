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
import { QueueSelectorRedisAccessConfiguration } from './queue-selector.redis.access.configuration.provider';
import { ReadQueueSelectorConfiguration } from './read-queue-selector.configuration.provider';
import { WriteQueueSelectorConfiguration } from './write-queue-selector.configuration.provider';

@Module({
  providers: [QueueSelectorRedisAccessConfiguration, ReadQueueSelectorConfiguration, WriteQueueSelectorConfiguration],
  exports: [QueueSelectorRedisAccessConfiguration, ReadQueueSelectorConfiguration, WriteQueueSelectorConfiguration],
})
export class QueueSelectorConfigurationModule {}