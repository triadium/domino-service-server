import { deferred } from 'promise-callbacks';
import { isEmpty, isNil, forOwn, defaultTo, toArray, cloneDeep } from 'lodash';
import { IStorage, ITransaction, ISession, IStorageMeta } from './storage.types';
import { IOmegaEta, IOmegaYota } from './query.types';
import { MongoClient, Db, ClientSession, FindOneOptions, UpdateWriteOpResult } from 'mongodb';
import { IEtaDto, NE, RoDtoType, IYotaDto, IAttributesDto, RoDtoIndexType } from './common.query.types';
import { ITetaEta, ITetaAttributes, TetaEta, TetaZeta, TetaAttributes } from './teta.types';
import Unique from './unique.attribute';

// tslint:disable:max-classes-per-file

export class MongoSession<R extends string> implements ISession<R> {
  private _session: ClientSession;

  constructor(client: MongoClient) {
    this._session = client.startSession();
  }

  startTransaction(): ITransaction<R> {
    return new BaseMongoTransaction(this._session);
  }

  async transactionWithRetry(operations: (tx: ITransaction<R>) => Promise<any>): Promise<any> {
    const tx = this.startTransaction();
    try {
      const result = await operations(tx);
      await tx.commitTransactionWithRetry();
      return result;
    } catch (error) {
      // FIXME: auto transaction aborted
      // await tx.abortTransaction();

      // If transient error, retry the whole transaction
      if (error.errorLabels && error.errorLabels.indexOf('TransientTransactionError') < 0) {
        return await this.transactionWithRetry(operations);
      } else {
        throw error;
      }
    }
  }

  endSession(): Promise<void> {
    const promise = deferred();
    this._session.endSession(promise.defer());
    return promise;
  }
}

export class BaseMongoTransaction<R extends string> implements ITransaction<R> {
  private _session: ClientSession;

  constructor(session: ClientSession) {
    this._session = session;
    this._session.startTransaction({ readConcern: { level: 'majority' }, writeConcern: { w: 'majority' } });
  }

  commitTransaction(): Promise<void> {
    return this._session.commitTransaction();
  }

  abortTransaction(): Promise<void> {
    return this._session.abortTransaction();
  }

  async commitTransactionWithRetry(): Promise<void> {
    try {
      await this.commitTransaction();
    } catch (error) {
      if (error.errorLabels && error.errorLabels.indexOf('UnknownTransactionCommitResult') < 0) {
        await this.commitTransactionWithRetry();
      } else {
        throw error;
      }
    }
  }

  read<U extends IAttributesDto>(omega: IOmegaEta): Promise<IEtaDto<R, U>> {
    throw new Error('Implement in the derived class');
  }

  write<D extends IAttributesDto, Z extends ITetaAttributes<D>>(teta: ITetaEta<R, D, Z>): Promise<string> {
    throw new Error('Implement in the derived class');
  }

  count(filter: any): Promise<number> {
    throw new Error('Method not implemented.');
  }
}

export class BaseMongoStorage<R extends string> implements IStorage<R> {
  protected _meta: IStorageMeta<string>;
  protected _client!: MongoClient;
  protected _db: Db;

  constructor(meta: IStorageMeta<R>, client: MongoClient, name: string) {
    this._meta = meta;
    this._client = client;
    this._db = this._client.db(name, { noListener: true });
  }

  startSession(): ISession<R> {
    return new MongoSession(this._client);
  }

  async withSession(operations: (session: ISession<R>) => Promise<any>): Promise<any> {
    const session = this.startSession();
    try {
      return await operations(session);
    } finally {
      await session.endSession();
    }
  }

  // FIXME: All specific functions are implemented like method of the storage?
  // FIXME: Teta and storage must use same functions for dto manipulation and checks?
  // FIXME: May be split into separate type classes: UnitKey, UnitRefKey, Table,...?

  /**
   * Count
   * Within transaction
   * let doc = db.getCollection('CNAME').aggregate([
   * { $match: <Query> },
   * { $skip?: <pn> }, { $limit?: <pn> },
   * { $group: { _id: 'count', n: { $sum: 1 } } }] )
   * return isNil(doc) ? 0 : doc.n;
   *
   * Without transaction
   * return db.getCollection('CNAME').count(query, {skip?, limit?});
   */

  async read<U extends IAttributesDto>(omega: IOmegaEta): Promise<IEtaDto<R, U>> {
    // if (isEmpty(omega.or)) {
    // }
    // else {
    //   return this.checkRoles<U>(omega.r, omega.u, omega.or!);
    // }

    const u1Role = omega.r;

    const result: IEtaDto<R, any> = { z: { r: NE, u: omega.u } };
    const readUnit = !isEmpty(omega.a);
    if (readUnit) {
      // FIXME: Empty attribute list will result in all fields being selected, let's avoid this
      const unitProjection: { [key: string]: 1 } = { _id: 1 };
      omega.a!.forEach(n => (unitProjection[n] = 1));
      const cnU1 = this._meta.unitCollectionName(u1Role);
      const unit = await this._db.collection(cnU1).findOne<{ _id: string; _r?: R[] }>({ _id: omega.u, _r: u1Role }, { projection: unitProjection });

      if (isNil(unit)) {
        return result;
      } else {
        result.z.r = u1Role as R;

        const ar = unit._r;
        if (!isNil(ar)) {
          delete unit._r;
          result.z.ar = ar;
        }
        // else{ roles have not been fetched }
        delete unit._id;
        // TODO: Transfer role version too

        result.z.a = unit as any;
      }
    }
    // else { skip }

    const readLinkages = !isEmpty(omega.roc);
    if (readLinkages) {
      const promises: Array<Promise<any>> = [];
      const roc: RoDtoIndexType<R> = {};
      result.roc = roc;

      const readYotaListData = async (yota: IOmegaYota, u2Role: string) => {
        // FIXME: skip linkage reading for empty ids array
        const snames = this._meta.uniqueSideNames(u1Role, u2Role);

        const readByIds = !isNil(yota.u);
        if (readByIds) {
          if (yota.u!.length > 0) {
            const idUnit2FullMap = new Map<string, number>();
            yota.u!.forEach((id, i) => idUnit2FullMap.set(id, i));

            const filter = { [snames[1]]: omega.u, [snames[2]]: { $in: yota.u } };

            const linkageProjection: { [key: string]: 1 } = { [snames[2]]: 1 };

            const readLinkage = !isEmpty(yota.la);
            if (readLinkage) {
              yota.la!.forEach(n => (linkageProjection[n] = 1));
            }
            // else { skip }

            const options: FindOneOptions = { projection: linkageProjection };

            if (!isNil(yota.o) && yota.o >= 0) {
              options.skip = yota.o;
            }
            // else { skip }

            if (!isNil(yota.l) && yota.l > 0) {
              options.limit = yota.l;
            }
            // else { skip }

            if (!isNil(yota.s)) {
              // FIXME: Sort does not work with indexes after $in selection
              const sort: { [key: string]: 1 | -1 } = { [snames[1]]: 1 };
              yota.s.forEach(si => (sort[si.key] = si.order));
              options.sort = sort;
            }
            // else { skip }

            const cnL = this._meta.linkageCollectionName(u1Role, u2Role);
            const linkages = await this._db
              .collection(cnL)
              .find(filter, options)
              .toArray();

            const outRo: RoDtoType<R, any, any> = [];
            outRo.length = linkages.length;
            roc[u2Role as R] = outRo;

            if (linkages.length > 0) {
              const readUnits = !isEmpty(yota.a);
              if (readUnits) {
                const idUnit2List: string[] = [];
                idUnit2List.length = linkages.length;
                linkages.forEach((linkage, i) => {
                  const idUnit2: string = linkage[snames[2]];
                  delete linkage[snames[2]];
                  delete linkage._id;
                  const outYota: IYotaDto<R, any, any> = { z: { u: idUnit2, r: u2Role as R }, la: linkage };
                  const index = idUnit2FullMap.get(idUnit2)!;
                  outRo[index] = outYota;
                  idUnit2List[i] = idUnit2;
                });

                // FIXME: Empty attribute list will result in all fields being selected, let's avoid this
                const unitProjection: { [key: string]: 1 } = { _id: 1 };
                yota.a!.forEach(n => (unitProjection[n] = 1));
                const cnU2 = this._meta.unitCollectionName(u2Role);
                const units = await this._db
                  .collection(cnU2)
                  .find<{ _id: string; _r?: R[] }>({ _id: { $in: idUnit2List }, _r: u2Role }, { projection: unitProjection })
                  .toArray();

                units.forEach(unit => {
                  const index = idUnit2FullMap.get(unit._id)!;
                  const ar = unit._r;
                  if (!isNil(ar)) {
                    delete unit._r;
                    outRo[index].z.ar = ar;
                  }
                  // else{ roles have not been fetched }
                  delete unit._id;
                  // TODO: Transfer role version too

                  outRo[index].z.a = unit;
                });
              } else {
                linkages.forEach((linkage, i) => {
                  const idUnit2 = linkage[snames[2]];
                  delete linkage[snames[2]];
                  delete linkage._id;
                  const outYota: IYotaDto<R, any, any> = { z: { u: idUnit2, r: u2Role as R }, la: linkage };
                  const index = idUnit2FullMap.get(idUnit2)!;
                  outRo[index] = outYota;
                });
              }

              // FIXME: Fill undefined ro items with null-yota instances
              outRo.forEach((outYota, i) => {
                if (isNil(outYota)) {
                  outRo[i] = { z: { u: yota.u![i], r: u2Role as R } };
                }
                // else { skip }
              });
            } else {
              // FIXME: Fill ro with null-yota instances
              yota.u!.forEach((id, i) => (outRo[i] = { z: { u: id, r: u2Role as R } }));
            }
          }
          // else { skip }
        } else {
          const filter = defaultTo(yota.f, {});
          filter[snames[1]] = omega.u;

          const linkageProjection: { [key: string]: 1 } = { [snames[2]]: 1 };

          const readLinkage = !isEmpty(yota.la);
          if (readLinkage) {
            yota.la!.forEach(n => (linkageProjection[n] = 1));
          }
          // else { skip }

          const options: FindOneOptions = { projection: linkageProjection };

          if (!isNil(yota.o) && yota.o >= 0) {
            options.skip = yota.o;
          }
          // else { skip }

          if (!isNil(yota.l) && yota.l > 0) {
            options.limit = yota.l;
          }
          // else { skip }

          if (!isNil(yota.s)) {
            // FIXME: Sort MUST use indexes always
            const sort: { [key: string]: 1 | -1 } = { [snames[1]]: 1 };
            yota.s.forEach(si => (sort[si.key] = si.order));
            options.sort = sort;
          }
          // else { skip }

          const cnL = this._meta.linkageCollectionName(u1Role, u2Role);
          const linkages = await this._db
            .collection(cnL)
            .find(filter, options)
            .toArray();

          const outRo: RoDtoType<R, any, any> = [];
          outRo.length = linkages.length;
          roc[u2Role as R] = outRo;

          if (linkages.length > 0) {
            const readUnits = !isEmpty(yota.a);
            if (readUnits) {
              const idMap = new Map<string, number>();
              const idUnit2List: string[] = [];
              idUnit2List.length = linkages.length;
              linkages.forEach((linkage, i) => {
                const idUnit2: string = linkage[snames[2]];
                delete linkage[snames[2]];
                delete linkage._id;
                const outYota: IYotaDto<R, any, any> = { z: { u: idUnit2, r: u2Role as R }, la: linkage };
                outRo[i] = outYota;
                idUnit2List[i] = idUnit2;
                idMap.set(idUnit2, i);
              });

              // FIXME: Empty attribute list will result in all fields being selected, let's avoid this
              const unitProjection: { [key: string]: 1 } = { _id: 1 };
              yota.a!.forEach(n => (unitProjection[n] = 1));
              const cnU2 = this._meta.unitCollectionName(u2Role);
              const units = await this._db
                .collection(cnU2)
                .find<{ _id: string; _r?: R[] }>({ _id: { $in: idUnit2List }, _r: u2Role }, { projection: unitProjection })
                .toArray();

              units.forEach(unit => {
                const index = idMap.get(unit._id)!;

                const ar = unit._r;
                if (!isNil(ar)) {
                  delete unit._r;
                  outRo[index].z.ar = ar;
                }
                // else{ roles have not been fetched }
                delete unit._id;
                // TODO: Transfer role version too

                outRo[index].z.a = unit;
              });
            } else {
              linkages.forEach((linkage, i) => {
                const idUnit2 = linkage[snames[2]];
                delete linkage[snames[2]];
                delete linkage._id;
                const outYota: IYotaDto<R, any, any> = { z: { u: idUnit2, r: u2Role as R }, la: linkage };
                outRo[i] = outYota;
              });
            }
          }
          // else { skip }
        }
      };

      forOwn(omega.roc!, (yota, u2Role) => {
        promises.push(readYotaListData(yota, u2Role));
      });

      await Promise.all(promises);
    }

    return result;
  }

  private generateDtoForInsert(delta: any, defaults: any): any {
    const values: any = {};
    forOwn(defaults, (v, k) => {
      if (isNil(delta[k])) {
        values[k] = cloneDeep(v);
      }
      // else { skip }
    });

    return values;
  }

  private fillUpdateData(data: any, delta: any, defaults: any) {
    let setOnInsert;
    if (isEmpty(delta)) {
      setOnInsert = cloneDeep(defaults);
    } else {
      data.$set = delta;
      setOnInsert = this.generateDtoForInsert(delta, defaults);
    }
    if (!isEmpty(setOnInsert)) {
      data.$setOnInsert = setOnInsert;
    }
    // else { skip }
  }

  // TODO: Append details in error messages
  /**
   * Write function returns unique of unit 1 (new or passed)
   * Error for null eta
   * Check teta zeta unique
   *  a) NE -> Error if role is not NE else it is regular unique (NE well-known unit instance)
   *  b) NE-LIKE -> Generate new unique, put to valid r-index, store as result
   *  c) Regular unique -> put to checking r-list if not in valid r-index, store as result
   * For every not-null yota unique in every Ro
   *  a) Error if yota unique equals NE or is NE-LIKE
   *  b) Put to checking r-list if not in valid r-index
   * For every checking r-list check count, move to valid-r index all uniques
   * Write unit 1 data if needed
   * For every not-null yota in every Ro write linkage data if needed
   * Return stored result
   */
  async write<D extends IAttributesDto, Z extends ITetaAttributes<D>>(teta: ITetaEta<R, D, Z>): Promise<string> {
    if (teta.isNull()) {
      throw new Error('Unable write null-eta');
    } else if (Unique.isNe(teta.zeta.unique) && teta.zeta.role !== NE) {
      throw new Error('Unable write NE-eta');
    } else {
      const ctx = teta.context;
      const u1Role = teta.zeta.role;
      const cnIndex: Map<string, Set<string>> = new Map();
      const urIndex: Map<string, R> = new Map();
      const uarListIndex: Map<string, Array<{ _id: string; _r: R[]; _rv: number }>> = new Map();

      const cnU1 = this._meta.unitCollectionName(u1Role);
      let unique1: string = NE;
      let u1CheckExtending = false;
      let versionU1 = 0;
      let isNewU1 = false;

      if (Unique.isNeLike(teta.zeta.unique)) {
        teta.zeta.setUnique(ctx.generateUnique(teta.zeta.unique));
        isNewU1 = true;
      } else {
        u1CheckExtending = true;
      }

      unique1 = teta.zeta.unique;

      teta.forEachRo((ro, u2Role) => {
        // FIXME: roname equals role name
        // Unit 1 Role cannot be equal to any Unit 2 Role
        if (u2Role === u1Role) {
          throw new Error('Unable to create a linkage with the same roles');
        }
        // else { skip }

        const cnU2 = this._meta.unitCollectionName(u2Role);
        let setU2 = cnIndex.get(cnU2);
        if (isNil(setU2)) {
          setU2 = new Set();
          cnIndex.set(cnU2, setU2);
        }
        // else { exists }

        ro.forEachYota(yota => {
          if (Unique.isNe(yota.zeta.unique) || Unique.isNeLike(yota.zeta.unique) || yota.zeta.role === NE) {
            throw new Error('Unable to create a linkage with NE-Unit');
          } else {
            setU2!.add(yota.zeta.unique);
            urIndex.set(yota.zeta.unique, yota.zeta.role as R);
          }
        });
      });

      const unitRolesAndVersions: FindOneOptions = { projection: { _id: 1, _rv: 1, _r: 1 } };
      if (u1CheckExtending) {
        const arvU1 = await this._db.collection(cnU1).findOne<{ _id: string; _r: R[]; _rv: number }>({ _id: unique1 }, unitRolesAndVersions);
        if (isNil(arvU1) || !this._meta.canExtendRoles(arvU1._r, u1Role)) {
          throw new Error('Could not extend roles for unit');
        }
        // else { ok }

        versionU1 = arvU1._r.indexOf(u1Role as R) > -1 ? arvU1._rv : 0;
      }
      // else { skip }

      const checkUniques = async (value: Set<string>, cn: string) => {
        const uniques: string[] = toArray(value) as any;
        const uars = await this._db
          .collection(cn)
          .find<{ _id: string; _r: R[]; _rv: number }>({ _id: { $in: uniques } }, unitRolesAndVersions)
          .toArray();
        if (uars.length === uniques.length) {
          uars.forEach(v => {
            const role: R = urIndex.get(v._id)!;
            if (v._r.indexOf(role) < 0) {
              throw new Error('Could not create linkage between units with roles');
            }
            // else { skip }
          });
          uarListIndex.set(cn, uars);
        } else {
          throw new Error('Some units do not exist');
        }
      };

      const checkUniquePromises: Array<Promise<any>>  = [];
      cnIndex.forEach((value, cn) => {
        checkUniquePromises.push(checkUniques(value, cn));
      });
      await Promise.all(checkUniquePromises);

      const writeUnit1 = isNewU1 || !teta.zeta.isNull();

      const promises: Array<Promise<UpdateWriteOpResult>> = [];

      if (writeUnit1) {
        const data: { [key: string]: any } = {};
        data.$addToSet = { _r: u1Role };
        if (versionU1 > 0) {
          data.$inc = { _rv: 1 };
        }
        // else { skip }
        const delta = teta.zeta.attributes.genDto(true);
        const defaults = teta.zeta.getDefaults();
        this.fillUpdateData(data, delta, defaults);
        // TODO: Session ref
        promises.push(this._db.collection(cnU1).updateOne({ _id: teta.zeta.unique }, data, { upsert: true }));
      }
      // else{ skip }

      teta.forEachRo((ro, u2Role) => {
        const cnL = this._meta.linkageCollectionName(u1Role, u2Role);
        ro.forEachYota(yota => {
          const snames = this._meta.uniqueSideNames(u1Role, u2Role);
          const linkageUnique = this._meta.linkageUnique(u1Role, unique1, u2Role, yota.zeta.unique);
          const data = {};
          const delta = yota.attributes.genDto(true) as { [key: string]: any };
          // FIXME: Always put _id1 and _id2 values into delta
          delta[snames[1]] = unique1;
          delta[snames[2]] = yota.zeta.unique;

          const defaults = yota.getDefaults();
          this.fillUpdateData(data, delta, defaults);

          // TODO: Session ref

          promises.push(this._db.collection(cnL).updateOne({ _id: linkageUnique }, data, { upsert: true }));
        });
      });

      // TODO: Check results
      const results = await Promise.all(promises);

      // TODO: Check roles' versions

      return unique1;
    }
  }

  count(filter: any): Promise<number> {
    throw new Error('Method not implemented.');
  }

  private checkRoles<U extends IAttributesDto>(role: string, u: string, roles: string[]): Promise<IEtaDto<R, U>> {
    return Promise.resolve() as any;
  }
}
