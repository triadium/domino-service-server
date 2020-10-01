import {
  UNIT_ROLE_TYPE,
  USER, USER_LIST_USER_ATTRIBUTE_NAME_TYPE,
  USER_LIST_CONTACT_ATTRIBUTE_NAME_TYPE,
} from './service.basis';

/**
 *
 *
 */

interface IUnit<ID, U, C> {
  id: ID;
  roles: U[];
  collection: C;
}

const ASCENDING_ORDER = 1;
const DESCENDING_ORDER = -1;
interface ILinkageIndexedAttribute<N> {
  key: N;
  order: (-1 | 1);
}

interface ILinkageIndex<U, N> {
  side: U;
  attributes?: Array<ILinkageIndexedAttribute<N>>;
}

interface ILinkage<U, N> {
  roles: [U, U];
  indexes: Array<ILinkageIndex<U, N>>;
}

/**
 *
 *
 */

type COLLECTION_NAME_TYPE = 'CFG' | 'U' | 'US';
type WELL_KNOWN_ID_TYPE = 'CFG';

const USER_LIST_USER: ILinkage<UNIT_ROLE_TYPE, USER_LIST_USER_ATTRIBUTE_NAME_TYPE> = {
  roles: ['UDL', 'U'],
  indexes: [
      {
        side: 'UDL',
        attributes: [{ key: 'udl_u_cl', order: ASCENDING_ORDER }],
      },
    ],
};

const USER_LIST_CONTACT: ILinkage<UNIT_ROLE_TYPE, USER_LIST_CONTACT_ATTRIBUTE_NAME_TYPE> = {
  roles: ['UDL', 'UC'],
  indexes: [
    {
      side: 'UDL',
      attributes: [{ key: 'udl_uc_v', order: ASCENDING_ORDER }],
    },
  ],
};

/**
 *
 *
 */
export const unitCollections: COLLECTION_NAME_TYPE[] = ['CFG', 'U', 'US'];

export const wellKnownUnits: Array<IUnit<WELL_KNOWN_ID_TYPE, UNIT_ROLE_TYPE, COLLECTION_NAME_TYPE>> = [
  {
    id: 'CFG',
    roles: ['CFG', 'UDL'],
    collection: 'CFG',
  },
];

export const linkages: Array<ILinkage<UNIT_ROLE_TYPE, string>> = [
  USER_LIST_USER,
  USER_LIST_CONTACT,
];
