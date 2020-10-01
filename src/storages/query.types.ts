
// <1>  U(id, ROLE.ADMIN)
//      U(id, [ROLE.ADMIN, ROLE.DESIGNER])
// <2>  U(id).unit([U.name, U.status])
// <3>  UL(id).U()
//      UL(id).U([id])
// <4>  UL(id).unit([UL.data]).U()
//      UL(id).unit([UL.data]).U([id])
// <5>  UL(id).U().linkage([UL_U.contacts, UL_U.hash])
//      UL(id).U([id]).linkage([UL_U.contacts, UL_U.hash])
// <6>  UL(id).unit([UL.data]).U().linkage([UL_U.contacts, UL_U.hash])
//      UL(id).unit([UL.data]).U(id).linkage([UL_U.contacts, UL_U.hash])
// <3'> UL(id).U().offset(i)
//      UL(id).U().limit(i)
//      UL(id).U().offset(i).limit(i)
//      UL(id).U().sortBy(IX_UL_U.name_AZ_state_ZA)
//      UL(id).U().offset(i).sortBy(IX_UL_U.name_AZ_state_ZA)
//      UL(id).U().limit(i).sortBy(IX_UL_U.name_AZ_state_ZA)
//      UL(id).U().offset(i).limit(i).sortBy(IX_UL_U.name_AZ_state_ZA)
//      UL(id).U().where({[UL_U.contacts]: value}).offset(i).limit(i).sortBy(IX_UL_U.name_AZ_state_ZA)
// <5'> UL(id).U().linkage([UL_U.contacts, UL_U.hash]).offset(i)
//      UL(id).U().linkage([UL_U.contacts, UL_U.hash]).limit(i)
//      UL(id).U().linkage([UL_U.contacts, UL_U.hash]).offset(i).limit(i)
//      UL(id).U().linkage([UL_U.contacts, UL_U.hash]).sortBy(IX_UL_U.name_AZ_state_ZA)
//      UL(id).U().linkage([UL_U.contacts, UL_U.hash]).offset(i).sortBy(IX_UL_U.name_AZ_state_ZA)
//      UL(id).U().linkage([UL_U.contacts, UL_U.hash]).limit(i).sortBy(IX_UL_U.name_AZ_state_ZA)
//      UL(id).U().linkage([UL_U.contacts, UL_U.hash]).offset(i).limit(i).sortBy(IX_UL_U.name_AZ_state_ZA)
//      UL(id).U().linkage([UL_U.contacts, UL_U.hash]).where({[UL_U.contacts]: value}).offset(i).limit(i).sortBy(IX_UL_U.name_AZ_state_ZA)
// <7>  UL(id).unit([UL.data])
//            .U().linkage([UL_U.contacts, UL_U.hash]).unit([U.name])
//            .where({[UL_U.contacts]: value})
//            .offset(i).limit(i)
//            .sortBy(IX_UL_U.name_AZ_state_ZA)
//

// tslint:disable:max-classes-per-file

import { isNil } from 'lodash';
import { valuesToArray } from './common.query.types';

/**
 *
 *
 *
 */

/**
 * For number-like values in documents
 * where the specified field exists
 */
interface IWhereComparison<T extends number> {
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
}

interface IWhereEquality<T extends string | number | boolean> {
  /** This is equal to { field: value } */
  $eq?: T;
  /**
   * This is equal to { field: { $not: { $eq: value } } }
   * The result includes documents without the specified field
   */
  $ne?: T;
}

interface IWhereInclude<T extends string | number | boolean> {
  /** This is equal to { $or: [{ field: value1 }, { field: value2 }, ...] */
  $in?: T[];
  /** This is equal to { $and: [{ field: { $ne: value1 } }, { field: { $ne: value2 } }, ...] */
  $nin?: T[];
}

interface IWhereLogicalNot<T> {
  $not: IWhereComparison<T extends Array<infer U> ?
                    U extends number ? U : never :
                    T extends number ? T : never> &
        IWhereEquality<T extends Array<infer U> ?
                    U extends string | number | boolean ? U : never :
                    T extends string | number | boolean ? T : never> &
        IWhereInclude<T extends Array<infer U> ?
                    U extends string | number | boolean ? U : never :
                    T extends string | number | boolean ? T : never>;
}

interface IWhereLogicalGroup<T, R extends keyof T> {
  $and?: Array<WhereExpresionType<T, R>>;
  $or?: Array<WhereExpresionType<T, R>>;
  $nor?: Array<WhereExpresionType<T, R>>;
}

type WhereExpresionType<T, R extends keyof T> = {
  [K in R]+?: ( T[K] extends Array<infer U> ? U : T[K] ) |
                    IWhereComparison<T[K] extends Array<infer U> ?
                                  U extends number ? U : never :
                                  T[K] extends number ? T[K] : never> |
                    IWhereEquality<T[K] extends Array<infer U> ?
                                  U extends string | number | boolean ? U : never :
                                  T[K] extends string | number | boolean ? T[K] : never> |
                    IWhereInclude<T[K] extends Array<infer U> ?
                                  U extends string | number | boolean ? U : never :
                                  T[K] extends string | number | boolean ? T[K] : never> |
                    IWhereLogicalNot<T[K]>
} & IWhereLogicalGroup<T, R>;

export interface IOmegaZeta {
  r: string;
  u: string;
  a?: string[];
  or?: string[];
}

export interface IOmegaYota {
  r: string;
  u?: string[];
  a?: string[];
  la?: string[];
  f?: any;
  s?: SideSortIndexType<any>;
  o?: number;
  l?: number;
}

export interface IOmegaEta extends IOmegaZeta {
  roc?: { [key: string]: IOmegaYota };
}

export interface IQueryResult<R> {
  genQueryEta(): R;
}

export const AZ_ORDER = 1;
export const ZA_ORDER = -1;
type QuerySortDirectionType = -1 | 1;

export interface IQuerySortIndex<R extends string> {
  key: R;
  order: QuerySortDirectionType;
}

export type SideSortIndexType<R extends string> = Array<IQuerySortIndex<R>>;

interface IOmegaUnit<D, R> {
  unit<N extends (keyof D) extends string ? (keyof D) : never>(fields: N | N[]): R & IQueryResult<IOmegaEta>;
}

interface IOmegaLinkage<D, R> {
  linkage<N extends (keyof D) extends string ? (keyof D) : never>(fields: N | N[]): R & IQueryResult<IOmegaEta>;
}

interface IOmegaSortBy<D> {
  sortBy<N extends keyof D>(index: SideSortIndexType<N extends string ? N : never>): IQueryResult<IOmegaEta>;
}

interface IOmegaLimit<D> {
  limit(value: number): IOmegaSortBy<D> & IQueryResult<IOmegaEta>;
}

interface IOmegaOffset<D> {
  offset(value: number): IOmegaLimit<D> & IOmegaSortBy<D> & IQueryResult<IOmegaEta>;
}

type ReadQueryRangeType<D> =
  IOmegaOffset<D> &
  IOmegaLimit<D> &
  IOmegaSortBy<D> &
  IQueryResult<IOmegaEta>;
type ReadQueryFilterType<D> = IOmegaWhere<D> & ReadQueryRangeType<D>;
export type ReadQueryChainType<U, L> =
  IOmegaLinkage<L, IOmegaUnit<U, ReadQueryFilterType<L>> & ReadQueryFilterType<L>> &
  IOmegaUnit<U, ReadQueryFilterType<L>> & ReadQueryFilterType<L>;

interface IOmegaWhere<T> {
  where<R extends keyof T>(conditions: WhereExpresionType<T, R> ): ReadQueryRangeType<T>;
}

export type ReadQueryForUnitType<U, TO> = TO & IOmegaUnit<U, TO> & IQueryResult<IOmegaEta>;

/**
 *
 *
 *
 */
export class BaseReadEtaQuery<R extends string> implements
  IOmegaUnit<any, any>,
  IOmegaLinkage<any, any>,
  IOmegaOffset<any>,
  IOmegaLimit<any>,
  IOmegaSortBy<any>,
  IOmegaWhere<any>,
  IQueryResult<IOmegaEta> {

  private _query: IOmegaEta;
  private _yota?: IOmegaYota;

  constructor(role: R, id: string, roles?: R | R[]) {
    this._query = {
      r: role,
      u: id,
    };

    this._query.or = valuesToArray(roles);
  }

  protected yota(role: R, ids?: string | string[]): this {

    if (isNil(this._query.roc)) {
      this._query.roc = {};
    }
    // else { exist }

    this._yota = {
      r: role,
      u: valuesToArray(ids),
    };
    this._query.roc[role] = this._yota;

    return this;
  }

  unit<N extends string>(fields: N | N[]): this {
    if (isNil(this._yota)) {
      this._query.a = valuesToArray(fields);
    }
    else {
      this._yota.a = valuesToArray(fields);
    }
    return this;
  }

  linkage<N extends string>(fields: N | N[]): this {
    this._yota!.la = valuesToArray(fields);
    return this;
  }

  offset(value: number): this {
    this._yota!.o = value;
    return this;
  }

  limit(value: number): this {
    this._yota!.l = value;
    return this;
  }

  sortBy(value: SideSortIndexType<any>): this {
    this._yota!.s = value;
    return this;
  }

  where(value: any): this {
    this._yota!.f = value;
    return this;
  }

  genQueryEta(): IOmegaEta {
    return this._query;
  }
}

export type UNIT_ATTRIBUTE_NAME_TYPE = '_r';

export interface IUnitDto {
  _r: string[];
}

export interface IUnitAttributeNames {
  roles: UNIT_ATTRIBUTE_NAME_TYPE;
}

export type NameSetType<T, R> = {
  [K in keyof T]: T[K] extends R ? T[K] : never;
};
