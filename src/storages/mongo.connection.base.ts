import { Injectable } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { IStorageConnection, IStorage, IStorageMeta } from './storage.types';
import { isNil } from 'lodash';

export interface IStorageConnectionOptions {
  host: string;
  userName?: string;
  password?: string;
  poolSize: number;
}

export class BaseMongoConnection<R extends string> implements IStorageConnection<R> {
  private _meta: IStorageMeta<R>;
  private _client!: MongoClient;
  private _storageMap: { [key: string]: IStorage<R> };

  constructor(meta: IStorageMeta<R>) {
    this._meta = meta;
    this._storageMap = {};
  }

  async prepare(options: IStorageConnectionOptions): Promise<void> {
    this._client = await MongoClient.connect(
      options.host,
      { poolSize: options.poolSize, useNewUrlParser: true },
    );
    this._storageMap = {};
  }

  protected createStorage(meta: IStorageMeta<R>, client: MongoClient, name: string): IStorage<R> {
    throw new Error('Implement in the derived class');
  }

  useStorage(name: string): IStorage<R> {
    let storage = this._storageMap[name];

    if (isNil(storage)) {
      storage = this.createStorage(this._meta, this._client, name);
      this._storageMap[name] = storage;
    }
    // else{ exists }
    return storage;
  }
}