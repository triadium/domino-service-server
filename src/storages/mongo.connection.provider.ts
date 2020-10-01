import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { BaseMongoConnection } from './mongo.connection.base';
import { IStorage, IStorageSetup, IStorageMeta } from './storage.types';
import { UNIT_ROLE_TYPE } from './service/service.basis';
import { MongoStorage } from './mongo.storage.provider';
import { MongoStorageMeta } from './mongo.storage.meta';

@Injectable()
export class MongoConnection extends BaseMongoConnection<UNIT_ROLE_TYPE> {

  MAIN_STORAGE(): IStorage<UNIT_ROLE_TYPE> {
    return this.useStorage('domino-main');
  }

  protected createStorage(meta: IStorageMeta<UNIT_ROLE_TYPE>, client: MongoClient, name: string): IStorage<UNIT_ROLE_TYPE> {
    return new MongoStorage(meta, client, name);
  }

  static provider(/* some aux options */) {
    return {
      provide: MongoConnection,
      useFactory: async (
        // configuration: MainStorageConnectionConfiguration,
        meta: MongoStorageMeta,
      ) => {
        const instance = new MongoConnection(meta);
        await instance.prepare({host: 'mongodb://127.0.0.1:27017', poolSize: 4});

        // FIXME: Uses direct here, but Setup/Update process MUST BE separated from Usual Operations process
        await (instance.MAIN_STORAGE() as any as IStorageSetup).setup();

        return instance;
      },
      inject: [/*MainStorageConnectionConfiguration, */ MongoStorageMeta],
    };
  }
}