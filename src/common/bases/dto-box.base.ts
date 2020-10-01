/**
 * Base DTO box with data validation
 * @module common/bases/dtobox.base
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 *
 * @description
 * DTO box instance stores a reference to the data and
 * applies a validation scheme to it
 */

import 'reflect-metadata';
import * as Joi from 'joi';
import { isNil } from 'lodash';
import { JOI_SCHEMA_METADATA_KEY } from '../constants.common';

/**
 * Defines the validatable class. This class can use schema for data validation.
 * @param { Joi.ObjectSchema } schema Object validation schema
 */
export function ValidationSchema(schema: Joi.ObjectSchema) {
  return (constructor: any) => {
    return Reflect.defineMetadata(JOI_SCHEMA_METADATA_KEY, schema, constructor.prototype);
  };
}

export interface IDto { }

/**
 * Box for a data, that can be validated.
 * Schema must be defined before 'validate' function call.
 * Use ValidationSchema decorator.
 */
export class DtoBox<T extends IDto> {
  data: T;

  constructor(data?: T) { this.data = data ? data : {} as any; }

  validate(): Joi.ValidationResult<T> {
    const schema = Reflect.getMetadata(JOI_SCHEMA_METADATA_KEY, this.constructor.prototype);
    if (isNil(schema)) {
      throw new Error('Validation schema is not defined. Use ValidationSchema decorator.');
    }
    else {
      return Joi.validate(this.data, schema);
    }
  }
}