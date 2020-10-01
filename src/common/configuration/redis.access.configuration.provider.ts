/**
 * Redis access configuration provider
 * @module common/configuration/redis.access.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import * as Joi from 'joi';
import { ValidationSchema } from '../../common/bases/dto-box.base';
import { Configuration } from '../../common/bases/configuration.base';
import { generateConfigurationName } from '../../common/utils';
import * as redis from 'redis';

type ConfigurationAttributesType = 'REDIS_HOST' | 'REDIS_PORT' | 'REDIS_PASSWORD';
type ConfigurationFlagsType = 'REDIS_ENABLE_OFFLINE_QUEUE';

@ValidationSchema(Joi.object({
  REDIS_HOST: Joi.string().hostname().default('127.0.0.1'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string(),
  REDIS_ENABLE_OFFLINE_QUEUE: Joi.boolean().default(true),
}))
export class RedisAccessConfiguration extends Configuration<ConfigurationAttributesType, ConfigurationFlagsType> {
  constructor(key: string) {
    const name = generateConfigurationName(key);
    super(name);
  }

  generateSettings(): redis.ClientOpts {
    return {
      host: this.get('REDIS_HOST'),
      port: this.get('REDIS_PORT'),
      password: this.get('REDIS_PASSWORD'),
      enable_offline_queue: this.isFlagSet('REDIS_ENABLE_OFFLINE_QUEUE'),
      /** always select a database with index 0 */
      db: 0,
    };
  }
}