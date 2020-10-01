/**
 * Configuration provider for queues
 * @module common/queue/queue.configuration.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import * as Queue from 'bee-queue';
import { ValidationSchema } from '../bases/dto-box.base';
import { Configuration } from '../bases/configuration.base';
import { generateConfigurationName } from '../utils';
import { QueueRedisAccessConfiguration } from './queue.redis.access.configuration.provider';

type ConfigurationAttributesType = 'QUEUE_PREFIX' | 'QUEUE_JOB_TIMEOUT';
type ConfigurationFlagsType = 'QUEUE_REMOVE_JOB_ON_SUCCESS' | 'QUEUE_REMOVE_JOB_ON_FAILURE';

@Injectable()
@ValidationSchema(Joi.object({
  QUEUE_PREFIX: Joi.string().default('bq'),
  QUEUE_JOB_TIMEOUT: Joi.number().integer().min(1000).default(9000),
  QUEUE_REMOVE_JOB_ON_SUCCESS: Joi.boolean().default(true),
  QUEUE_REMOVE_JOB_ON_FAILURE: Joi.boolean().default(true),
}))
export class QueueConfiguration extends Configuration<ConfigurationAttributesType, ConfigurationFlagsType> {
  private readonly accessConfiguration: QueueRedisAccessConfiguration;

  constructor(accessConfiguration: QueueRedisAccessConfiguration) {
    const name = generateConfigurationName('queue');
    super(name);
    this.accessConfiguration = accessConfiguration;
  }

  generateSettings(isWorker: boolean): Queue.QueueSettings {
    return {
      prefix: this.get('QUEUE_PREFIX'),
      stallInterval: this.get('QUEUE_JOB_TIMEOUT'),
      nearTermWindow: 1200000,
      delayedDebounce: 1000,
      redis: this.accessConfiguration.generateSettings(),
      isWorker,
      getEvents: !isWorker,
      sendEvents: isWorker,
      storeJobs: true,
      ensureScripts: true,
      activateDelayedJobs: false,
      removeOnSuccess: this.isFlagSet('QUEUE_REMOVE_JOB_ON_SUCCESS'),
      removeOnFailure: this.isFlagSet('QUEUE_REMOVE_JOB_ON_FAILURE'),
      redisScanCount: 100,
    };
  }
}