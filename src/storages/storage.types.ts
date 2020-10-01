import { IOmegaEta } from './query.types';
import { IEtaDto, IAttributesDto } from './common.query.types';
import { ITetaEta, ITetaAttributes } from './teta.types';

export interface IStorageConnection<R extends string> {
  useStorage(name: string): IStorage<R>;
}

export interface IStorageOperations<R extends string> {
  read<U extends IAttributesDto>(omega: IOmegaEta): Promise<IEtaDto<R, U>>;
  write<D extends IAttributesDto, Z extends ITetaAttributes<D>>(teta: ITetaEta<R, D, Z>): Promise<string>;
  count(filter: any): Promise<number>;
}

export interface ITransaction<R extends string> extends IStorageOperations<R> {
  commitTransaction(): Promise<void>;
  abortTransaction(): Promise<void>;
  commitTransactionWithRetry(): Promise<void>;
}

export interface ISession<R extends string> {
  startTransaction(): ITransaction<R>;
  transactionWithRetry<T>(txFn: (tx: ITransaction<R>) => Promise<T>): Promise<T>;
  endSession(): Promise<void>;
}

export interface IStorage<R extends string> extends IStorageOperations<R> {
  startSession(): ISession<R>;
  withSession<T>(fn: (session: ISession<R>) => Promise<T>): Promise<T>;
}

export interface IStorageSetup {
  setup(): Promise<void>;
}

export interface IStorageMeta<R extends string> {
  unitCollectionName(role: R): string;
  linkageCollectionName(roleA: R, roleB: R): string;
  uniqueSideNames(roleA: R, roleB: R): [undefined, string, string];
  linkageUnique(roleA: R, uniqueA: string, roleB: R, uniqueB: string): string;
  canExtendRoles(roles: R[], newRole: R): boolean;
}