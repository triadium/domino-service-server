/**
 * Configuration provider for queues
 * @module common/queue/queue.configuration.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import * as Joi from 'joi';
import { ValidationSchema } from './dto-box.base';
import { Configuration } from './configuration.base';
import { generateConfigurationName } from '../utils';

type ConfigurationAttributesType = 'QUEUE_SELECTOR_PREFIX' | 'QUEUE_SELECTOR_SCRIPT_PATH';
type ConfigurationFlagsType = '';

@ValidationSchema(Joi.object({
  QUEUE_SELECTOR_PREFIX: Joi.string().min(1).required(),
  QUEUE_SELECTOR_SCRIPT_PATH: Joi.string().required(),
}))
export class QueueSelectorConfiguration extends Configuration<ConfigurationAttributesType, ConfigurationFlagsType> {
  constructor(key: string) {
    const name = generateConfigurationName(key);
    super(name);
  }
}