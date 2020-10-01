/**
 * Base configuration provider
 * @module common/bases/configuration.base
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 *
 * @description
 * Configuration instance reads a file in sync way and
 * validates content according with Joi object schema
 * Joi schema must be declared with ValidationSchema decorator
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { IDto, DtoBox } from './dto-box.base';

interface IConfigurationData extends IDto {
  [prop: string]: string | number | boolean;
}

export interface IConfiguration<A extends string, F extends string> {
  get(key: A): any;
  isFlagSet(key: F): boolean;
}

export class Configuration<A extends string, F extends string> extends DtoBox<IConfigurationData> implements IConfiguration<A, F> {

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    super(config);

    const { error, value } = this.validate();

    if (error) {
      throw error;
    }
    else {
      this.data = value;
    }
  }

  /**
   * Get a value from configuration data with the key
   * @param key Key of a value
   * @returns Value with a type, restricted by Joi schema
   */
  get(key: A): any {
    return this.data[key];
  }

  isFlagSet(key: F): boolean {
    return Boolean(this.data[key]);
  }
}
