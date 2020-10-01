/**
 * Configuration provider for web server start up
 * @module configuration/web/web.configuration.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import * as Joi from 'joi';
import { ValidationSchema } from '../bases/dto-box.base';
import { Configuration } from '../bases/configuration.base';
import { generateConfigurationName } from '../utils';

type ConfigurationAttributesType = 'WEB_SERVER_PORT' | 'WEB_SERVER_PUBLIC_PATH';
type ConfigurationFlagsType = '';

@ValidationSchema(Joi.object({
  WEB_SERVER_PORT: Joi.number().port().default(3000),
  WEB_SERVER_PUBLIC_PATH: Joi.string(),
}))
export class WebServerConfiguration extends Configuration<ConfigurationAttributesType, ConfigurationFlagsType> {
  constructor() {
    const name = generateConfigurationName('web');
    super(name);
  }
}
