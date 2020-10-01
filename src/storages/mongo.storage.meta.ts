import { Injectable } from '@nestjs/common';
import { isNil, forEach } from 'lodash';
import { UNIT_ROLE_TYPE } from './service/service.basis';
import { IStorageMeta } from './storage.types';

type CollectionNameIndexType<R extends string> = { [key in R]: string; };
type UniqueSideNamesIndexType<R extends string> = { [key in R]: [undefined, string, string]; };
type RoleSideIndexType<R extends string> = { [key in R]: 1 | 2; };
type RoleExtendIndexType<R extends string> = { [key in R]: R[]; };

type ChainIndexType<R extends string, S extends { [subkey in R]?: any; } > = { [key in R]?: S };
type LinkageCollectionNameChainIndexType<R extends string> = { [key in R]?: Partial<CollectionNameIndexType<R>> };
type UniqueSideNamesChainIndexType<R extends string> = { [key in R]?: Partial<UniqueSideNamesIndexType<R>> };
type RoleSideChainIndexType<R extends string> = { [key in R]?: Partial<RoleSideIndexType<R>> };

@Injectable()
export class MongoStorageMeta implements IStorageMeta<UNIT_ROLE_TYPE> {

  // TODO: Use setup data!
  private readonly _unitCollectionNameIndex: CollectionNameIndexType<UNIT_ROLE_TYPE> = {
    CFG: 'CFG',
    UDL: 'CFG',
    U: 'U',
    US: 'US',
    UC: 'U',
  };

  private readonly _roleExtendIndex: Partial<RoleExtendIndexType<UNIT_ROLE_TYPE>> = {
    CFG: ['UDL'],
  };

  private readonly _linkageCollectionNameIndex: LinkageCollectionNameChainIndexType<UNIT_ROLE_TYPE> = {};
  private readonly _uniqueSideNamesIndex: UniqueSideNamesChainIndexType<UNIT_ROLE_TYPE> = {};
  private readonly _roleSideIndex: RoleSideChainIndexType<UNIT_ROLE_TYPE> = {};

  constructor() {
    const linkageDefinitions: Array<[UNIT_ROLE_TYPE, UNIT_ROLE_TYPE]> = [
      ['UDL', 'U'],
      ['UDL', 'UC'],
    ];

    linkageDefinitions.forEach(([roleA, roleB]) => {
      const lcnA = this._getLinkageChainSubIndex(roleA, this._linkageCollectionNameIndex);
      const lcnB = this._getLinkageChainSubIndex(roleB, this._linkageCollectionNameIndex);
      const usnA = this._getLinkageChainSubIndex(roleA, this._uniqueSideNamesIndex);
      const usnB = this._getLinkageChainSubIndex(roleB, this._uniqueSideNamesIndex);
      const rsA = this._getLinkageChainSubIndex(roleA, this._roleSideIndex);
      const rsB = this._getLinkageChainSubIndex(roleB, this._roleSideIndex);

      const lcn = `${roleA}.${roleB}`;
      lcnA[roleB] = lcn;
      lcnB[roleA] = lcn;

      const ids12: [undefined, string, string] = [undefined, '_id1', '_id2'];
      const ids21: [undefined, string, string] = [undefined, '_id2', '_id1'];
      usnA[roleB] = ids12;
      usnB[roleA] = ids21;

      rsA[roleB] = 1;
      rsB[roleA] = 2;

    });
  }

  private _getLinkageChainSubIndex<R extends string, U>(role: R, index: ChainIndexType<R, U>): U {
    let subIndex = index[role];
    if (isNil(subIndex)) {
      subIndex = {} as U;
      index[role] = subIndex;
    }
    // else { noop }
    return subIndex as U;
  }

  unitCollectionName(role: UNIT_ROLE_TYPE): string {
    const cn = this._unitCollectionNameIndex[role];
    if (isNil(cn)) {
      throw new Error('There is no collection name for role');
    }
    // else { ok }
    return cn;
  }

  linkageCollectionName(roleA: UNIT_ROLE_TYPE, roleB: UNIT_ROLE_TYPE): string {
    const index = this._linkageCollectionNameIndex[roleA];
    const cn = isNil(index) ? undefined : index[roleB];
    if (isNil(cn)) {
      throw new Error('There is no collection name for roles');
    }
    // else { ok }
    return cn;
  }

  uniqueSideNames(roleA: UNIT_ROLE_TYPE, roleB: UNIT_ROLE_TYPE): [undefined, string, string] {
    const index = this._uniqueSideNamesIndex[roleA];
    const usn = isNil(index) ? undefined : index[roleB];
    if (isNil(usn)) {
      throw new Error('There is no linkage class for roles');
    }
    // else { ok }
    return usn;
  }

  linkageUnique(roleA: UNIT_ROLE_TYPE, uniqueA: string, roleB: UNIT_ROLE_TYPE, uniqueB: string): string {
    const index = this._roleSideIndex[roleA];
    const rs = isNil(index) ? undefined : index[roleB];
    if (isNil(rs)) {
      throw new Error('There is no linkage class for roles');
    }
    // else { ok }

    return (rs === 1 ? `${uniqueA}$${uniqueB}` : `${uniqueB}$${uniqueA}`);
  }

  canExtendRoles(roles: UNIT_ROLE_TYPE[], newRole: UNIT_ROLE_TYPE): boolean {
    if (roles.length === 0 || roles.indexOf(newRole) >= 0) {
      return true;
    }
    // else { ok }

    let can = false;
    forEach(roles, role => {
      const extend = this._roleExtendIndex[role];
      can = !isNil(extend) && (extend.indexOf(newRole) >= 0);
      return !can;
    });
    return can;
  }

}