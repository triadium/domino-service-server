/**
 * Configuration provider for web cluster start up
 * @module web/configuration/web.cluster.configuration.provider
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

import * as Joi from 'joi';
import { ValidationSchema } from '../bases/dto-box.base';
import { UnitConfiguration } from '../bases/unit.configuration.base';

@ValidationSchema(Joi.object({
  UNIT_QUEUE_PREFIX: Joi.string().min(1).required(),
  UNIT_QUEUE_COUNT: Joi.number().integer().min(1).default(1),
  UNIT_COUNT_FOR_QUEUE: Joi.number().integer().min(1).max(1).default(1),
  UNIT_QUEUE_CONCURRENCY: Joi.number().integer().min(1).max(1).default(1),
}))
export class WriteUnitConfiguration extends UnitConfiguration {
  constructor() {
    super('write-unit');
  }
}