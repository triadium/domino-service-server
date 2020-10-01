/**
 * Storage module
 * @module storage/storage.module
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 *
 * @description
 */

import { Module } from '@nestjs/common';
import { MongoConnection } from './mongo.connection.provider';
import { MongoStorageMeta } from './mongo.storage.meta';

@Module({
  providers: [MongoConnection.provider(), MongoStorageMeta],
  exports: [MongoConnection, MongoStorageMeta],
})
export class StorageModule {}