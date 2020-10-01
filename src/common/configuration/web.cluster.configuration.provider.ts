/**
 * Configuration provider for web cluster start up
 * @module web/configuration/web.cluster.configuration.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import * as Joi from 'joi';
import { ValidationSchema } from '../bases/dto-box.base';
import { Configuration } from '../bases/configuration.base';
import { generateConfigurationName } from '../utils';

type ConfigurationAttributesType = 'NODE_ENV' | 'WEB_CLUSTER_NODE_COUNT';
type ConfigurationFlagsType = 'WEB_CLUSTER_VERBOSE' | 'WEB_CLUSTER_NODE_RESPAWN';

@ValidationSchema(Joi.object({
  NODE_ENV: Joi.string()
    .valid(['development', 'production', 'test'])
    .default('development'),
  WEB_CLUSTER_NODE_COUNT: Joi.number().integer().min(1),
  WEB_CLUSTER_VERBOSE: Joi.boolean().default(false),
  WEB_CLUSTER_NODE_RESPAWN: Joi.boolean().default(true),
}))
export class WebClusterConfiguration extends Configuration<ConfigurationAttributesType, ConfigurationFlagsType> {
  constructor() {
    const name = generateConfigurationName('web.cluster');
    super(name);
  }
}