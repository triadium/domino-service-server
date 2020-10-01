import { isNil } from 'lodash';
import { IStorageSetup } from './storage.types';
import { BaseMongoTransaction, BaseMongoStorage } from './mongo.storage.base';
import { UNIT_ROLE_TYPE } from './service/service.basis';
import { unitCollections, wellKnownUnits, linkages } from './service/service.setup';

// tslint:disable:max-classes-per-file

export class MongoTransaction extends BaseMongoTransaction<UNIT_ROLE_TYPE> {
}

export class MongoStorage extends BaseMongoStorage<UNIT_ROLE_TYPE> implements IStorageSetup {
  async setup(): Promise<void> {

    await Promise.all(unitCollections.map(collection => this._db.createCollection(collection, { w: 'majority' })));

    wellKnownUnits.forEach(unit => {
      const collection = this._db.collection(unit.collection);
      collection.findOne<{}>({_id: unit.id}).then(udoc => {
        if (isNil(udoc)) {
          collection.insertOne({ _id: unit.id, _r: unit.roles });
        }
        // TODO: Use factories' data!
        // FIXME: fill new (undefined) attributes
        // else { skip }
      });
    });

    await Promise.all(linkages.map(linkage => this._db.createCollection(linkage.roles.join('.'))));

    await Promise.all(linkages.map(linkage => {
      const linkageIndexes = linkage.indexes.map(index => {
        const side = linkage.roles.indexOf(index.side) + 1;
        let name = `_id${side}`;
        const keys = { [name]: 1 };
        if (!isNil(index.attributes)) {
          index.attributes.forEach(attribute => {
            name += `_${attribute.key}_${attribute.order > 0 ? 'AZ' : 'ZA'}`;
            keys[attribute.key] = attribute.order;
          });
        }
        // else { only side }
        // FIXME: it is simple none-unique index
        const outIndex = { key: keys, name };
        return outIndex;
      });

      const collection = this._db.collection(linkage.roles.join('.'));
      return collection.createIndexes(linkageIndexes);
    }));

  }
}