import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Type, Logger } from '@nestjs/common';
import * as path from 'path';
import { toString, toInteger, bind, isNil, isFunction } from 'lodash';
import * as Queue from 'bee-queue';
import { UnitAppModule } from './unit.app.module';
import {
  COMMAND_PATH_METADATA_KEY,
  COMMAND_PARAMETERS_METADATA_KEY,
  PARAMTYPES_METADATA,
  NEST_CONTROLLERS_METADATA_KEY,
} from '../common/constants.common';
import { isConstructorName } from '../common/utils';
import { QueueList } from '../common/bases/queue-list.base';
import { QueueConfiguration } from '../common/configuration/queue.configuration.provider';

const queueName = toString(process.env.UNIT_QUEUE_NAME);
const queueConcurrency = toInteger(process.env.UNIT_QUEUE_CONCURRENCY);
const index = toInteger(process.env.UNIT_INDEX);
const unitType = toString(process.env.UNIT_TYPE) as 'W' | 'R';

async function bootstrap() {
  const routes: { [key: string]: any } = {};
  const sendToMaster = bind(process.send as (message: any, sendHandle?: any) => void, process);

  const app = await NestFactory.createApplicationContext(UnitAppModule);

  /**
   * Building of route's handlers. Nest uses separate collection for controller instances.
   * Getting only one level of hierarchy. @Processor and @Command decorators must be defined only
   * for a derived class, specified in the module's controllers.
   */
  const processors: Array<Type<any>> = Reflect.getMetadata(NEST_CONTROLLERS_METADATA_KEY, UnitAppModule);
  processors.forEach(processorType => {
    const instance = app.get(processorType);
    const proto = Object.getPrototypeOf(instance);
    const basePath = Reflect.getMetadata(COMMAND_PATH_METADATA_KEY, instance.constructor);
    const names = Object.getOwnPropertyNames(proto);
    names.forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(proto, name);
      const handler = proto[name];
      if (isFunction(handler) && !(isConstructorName(name) || isNil(descriptor) || descriptor.set || descriptor.get)) {
        const routePath = Reflect.getMetadata(COMMAND_PATH_METADATA_KEY, handler);
        if (!isNil(routePath)) {
          const commandPath = path.posix.join('/', basePath, routePath);
          routes[commandPath] = { processor: instance, handler };
        }
        // else { skip }
      }
      // else { skip }
    });
  });

  const queueConfiguration = app.get(QueueConfiguration);
  const queueSettings = queueConfiguration.generateSettings(true);
  const queue = await QueueList.createQueue(queueName, queueSettings);
  queue.process(queueConcurrency, (job: Queue.Job, done: Queue.DoneCallback<any>) => {
    const name = job.data.name;
    const command = routes[name];
    if (isNil(command)) {
      done(new Error(`Command ${name} does not exist.`));
    } else {
      const processorProto = Object.getPrototypeOf(command.processor);
      const params = Reflect.getOwnMetadata(COMMAND_PARAMETERS_METADATA_KEY, processorProto, command.handler.name);

      if (isNil(params)) {
        Promise.resolve(command.handler.call(command.processor)).then((result: any) => done(null, result));
      }
      else {
        const args: any[] = [];
        const paramtypes = Reflect.getMetadata(PARAMTYPES_METADATA, processorProto, command.handler.name);

        // TODO: create common solve
        if (isNil(job.data.delta) && params.delta.length > 0) {
          return done(new Error(`"Delta" data is required for the command ${name}`));
        }
        else {
          params.delta.forEach((element: { index: number, key?: string }) => {
            const i = element.index;
            if (isNil(element.key)) {
              args[i] = job.data.delta;
            }
            else {
              args[i] = job.data.delta[element.key];
            }

            if (isFunction(paramtypes[i])) {
              args[i] = new paramtypes[i](args[i]);
            }
            // else{ raw data }
          });
        }

        if (isNil(job.data.pi) && params.pi.length > 0) {
          return done(new Error(`"Pi" data is required for the command ${name}`));
        }
        else {
          params.pi.forEach((element: { index: number, key?: string }) => {
            const i = element.index;
            if (isNil(element.key)) {
              args[i] = job.data.pi;
            }
            else {
              args[i] = job.data.pi[element.key];
            }

            if (isFunction(paramtypes[i])) {
              args[i] = new paramtypes[i](args[i]);
            }
            // else{ raw data }
          });
        }

        Promise.resolve(command.handler.apply(command.processor, args)).then(result => done(null, result)).catch(error => {
          Logger.error(`Command {${name}} error: ${error.message}`, undefined, command.processor.constructor.name, false);
          done(new Error(`Processor [${command.processor.constructor.name}] internal error`));
        });
      }
    }
  });

  sendToMaster(`Unit worker(${unitType}) ${queueName}:${index} online. Ready process ${queueConcurrency} jobs.`);
}
bootstrap();
