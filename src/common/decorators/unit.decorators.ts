import 'reflect-metadata';
import { isNil } from 'lodash';
import { COMMAND_PATH_METADATA_KEY, COMMAND_PARAMETERS_METADATA_KEY } from '../constants.common';

export function Processor(prefix?: string): ClassDecorator {
  const path = isNil(prefix) ? '/' : prefix;
  return (target: object) => {
    Reflect.defineMetadata(COMMAND_PATH_METADATA_KEY, path, target);
  };
}

export function Command(prefix?: string): MethodDecorator {
  const path = isNil(prefix) ? '' : prefix;
  return (target, key, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(COMMAND_PATH_METADATA_KEY, path, descriptor.value);
    return descriptor;
  };
}

// TODO: create common solve
export function Delta(key?: string) {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    const params = Reflect.getOwnMetadata(COMMAND_PARAMETERS_METADATA_KEY, target, propertyKey) || { delta: [], pi: [] };
    params.delta.push({ index: parameterIndex, key });
    Reflect.defineMetadata(COMMAND_PARAMETERS_METADATA_KEY, params, target, propertyKey);
  };
}

export function Pi(key?: string) {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    const params = Reflect.getOwnMetadata(COMMAND_PARAMETERS_METADATA_KEY, target, propertyKey) || { delta: [], pi: [] };
    params.pi.push({ index: parameterIndex, key });
    Reflect.defineMetadata(COMMAND_PARAMETERS_METADATA_KEY, params, target, propertyKey);
  };
}
