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
import { ReadUnitConfiguration } from './read-unit.configuration';
import { WriteUnitConfiguration } from './write-unit.configuration';

@Module({
  providers: [ReadUnitConfiguration, WriteUnitConfiguration],
  exports: [ReadUnitConfiguration, WriteUnitConfiguration],
})
export class UnitConfigurationModule {}