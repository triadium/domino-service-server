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
import { QueueRedisAccessConfiguration } from './queue.redis.access.configuration.provider';
import { QueueConfiguration } from './queue.configuration.provider';

@Module({
  providers: [QueueRedisAccessConfiguration, QueueConfiguration],
  exports: [QueueConfiguration],
})
export class QueueConfigurationModule {}