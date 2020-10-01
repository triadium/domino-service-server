/**
 * Configuration provider for web cluster start up
 * @module web/configuration/web.cluster.configuration.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import { Configuration, IConfiguration } from './configuration.base';
import { generateConfigurationName } from '../utils';

type ConfigurationAttributesType = 'UNIT_QUEUE_PREFIX' | 'UNIT_QUEUE_COUNT' | 'UNIT_COUNT_FOR_QUEUE' | 'UNIT_QUEUE_CONCURRENCY';
type ConfigurationFlagsType = '';

export interface IUnitConfiguration extends IConfiguration<ConfigurationAttributesType, ConfigurationFlagsType> { }

export class UnitConfiguration extends Configuration<ConfigurationAttributesType, ConfigurationFlagsType> {
  constructor(key: string) {
    const name = generateConfigurationName(key);
    super(name);
  }
}