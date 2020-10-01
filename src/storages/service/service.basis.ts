import { isNil } from 'lodash';
import { IEtaDto, IAttributesDto } from '../common.query.types';
import Unique from '../unique.attribute';
import {
  IUnitAttributeNames,
  NameSetType,
  BaseReadEtaQuery,
  IQueryResult,
  IOmegaEta,
  ReadQueryForUnitType,
  SideSortIndexType,
  AZ_ORDER,
  IUnitDto,
  ReadQueryChainType,
} from '../query.types';
import {
  ITetaContext,
  TetaRoFactoryIndexType,
  TetaYota,
  TetaRoFactory,
  TetaRo,
  BaseTetaContext,
  ITetaAttributes,
  ITetaRo,
  TetaAttributes,
  TetaEta,
  IEmptyTetaAttributes,
  ITetaEta,
  TetaZetaFactory,
  TetaAttributesFactory,
  TetaZeta,
  TetaYotaFactory,
  TetaEtaFactory,
} from '../teta.types';

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

// tslint:disable:max-classes-per-file
// tslint:disable:max-line-length

/**
 * Unions of names
 */

/**
 * Role names
 */
/**
 * A
 */
export type UNIT_ROLE_TYPE = 'CFG' | 'UDL' | 'U' | 'US' | 'UC'; // | 'ASEC' | 'ANOD'; // | 'ADMIN' | 'DESIGNER';

/**
 * Enum values
 */
/**
 * D
 */
type USER_STATE_ENUM_TYPE = 'active' | 'ban' | 'old';
type AUTHORIZATION_MODE_ENUM_TYPE = 'password' | 'reset' | 'code';
export type CONTACT_TYPE_ENUM_TYPE = 'phone' | 'mobile' | 'email' | 'fkey';
type CONTACT_STATE_ENUM_TYPE = 'pending' | 'valid' | 'manual';

/**
 * Attribute names for units
 */
/**
 * C
 */
type CONFIGURATION_ATTRIBUTE_NAME_TYPE = 'cfg_sms_ccmsg' | 'cfg_sms_sid' | 'cfg_sms_sname';
type USER_ATTRIBUTE_NAME_TYPE = 'u_n' | 'u_s' | 'u_i';
type CONTACT_ATTRIBUTE_NAME_TYPE = 'uc_v';

/**
 * Attribute names for linkages
 */
/**
 * O
 */
export type USER_LIST_USER_ATTRIBUTE_NAME_TYPE = 'udl_u_p' | 'udl_u_m' | 'udl_u_cl' | 'udl_u_tl' | 'udl_u_sl';
export type USER_LIST_CONTACT_ATTRIBUTE_NAME_TYPE = 'udl_uc_v' | 'udl_uc_t' | 'udl_uc_c' | 'udl_uc_cgts' | 'udl_uc_cgpsp';

/**
 * Shapes for names
 */
/**
 * V
 */
interface IKnownIds {
  CONFIGURATION: 'CFG';
}

/**
 * Role names shape
 */
/**
 * B
 */
interface IUnitRole {
  CONFIGURATION: 'CFG';
  USER_LIST: 'UDL';
  USER: 'U';
  USER_SESSION: 'US';
  CONTACT: 'UC';
  // ADMINISTRATOR: 'ADMIN';
  // DESIGNER: 'DESIGNER';
}

/**
 * Enum names shapes
 */
/**
 * E
 */
interface IUserStateEnum {
  active: 'active';
  ban: 'ban';
  old: 'old';
}

interface IAuthorizationModeEnum {
  password: 'password';
  reset: 'reset';
  code: 'code';
}

interface IContactTypeEnum {
  phone: 'phone';
  mobile: 'mobile';
  email: 'email';
  fkey: 'fkey';
}

interface IContactStateEnum {
  pending: 'pending';
  valid: 'valid';
  manual: 'manual';
}

/**
 * Unit names shapes
 */
/**
 * F
 */
interface IConfigurationAttributeNames {
  smsConfirmationCodeMessage: 'cfg_sms_ccmsg';
  smsServiceId: 'cfg_sms_sid';
  smsSenderName: 'cfg_sms_sname';
}

interface IUserAttributeNames {
  name: 'u_n';
  state: 'u_s';
  info: 'u_i';
}

interface IContactAttributeNames {
  value: 'uc_v';
}

/**
 * Linkage names shapes
 */
/**
 * P
 */
interface IUserListUserAttributeNames {
  /** Контакт */
  primary: 'udl_u_p';
  /** Режим авторизации пользователя (AUTHORIZATION_MODE_ENUM) */
  mode: 'udl_u_m';
  /** CONTACT_TYPE_ENUM */
  contacts: 'udl_u_cl';
  /** CONTACT_TYPE_ENUM */
  types: 'udl_u_tl';
  states: 'udl_u_sl';
}

interface IUserListContactAttributeNames {
  value: 'udl_uc_v';
  type: 'udl_uc_t';
  code: 'udl_uc_c';
  codeGenTimestamp: 'udl_uc_cgts';
  codeGenPauseSpan: 'udl_uc_cgpsp';
}

/**
 * Unit DTO shapes
 */
/**
 * G
 */
export interface IConfigurationDto {
  cfg_sms_ccmsg: string;
  cfg_sms_sid: string;
  cfg_sms_sname: string;
}

interface IUserDto {
  u_n: string;
  u_s: USER_STATE_ENUM_TYPE;
  u_i: string;
}

interface IUserSessionDto {}

interface IContactDto {
  uc_v: string;
}

// interface IAdvSectionDto {}

// interface IAdvNodeDto {
//   anod_name: string;
// }

/**
 * Linkage DTO shapes
 */
/**
 * Q
 */
interface IUserListUserDto {
  udl_u_p: string[];
  udl_u_m: AUTHORIZATION_MODE_ENUM_TYPE;
  /** Contacts band */
  udl_u_cl: string[];
  udl_u_tl: CONTACT_TYPE_ENUM_TYPE[];
  udl_u_sl: CONTACT_STATE_ENUM_TYPE[];
}

interface IUserListContactDto {
  udl_uc_v: string;
  udl_uc_t: CONTACT_TYPE_ENUM_TYPE;
  udl_uc_c: string;
  udl_uc_cgts: number;
  udl_uc_cgpsp: number;
}

/**
 * Link-to shapes
 */
// W
interface IConfigurationLinkTo { }

interface IUserListLinkTo {
  USER(ids?: string | string[]): ReadQueryChainType<IUserDto, IUserListUserDto>;

  CONTACT(ids?: string | string[]): ReadQueryChainType<IContactDto, IUserListContactDto>;
}

interface IUserLinkTo {
  USER_LIST(ids?: string | string[]): ReadQueryChainType<IUnitDto, IUserListUserDto>;
}

interface IUserSessionLinkTo {}

interface IAdvSectionLinkTo {}

interface IAdvNodeLinkTo {}

/**
 * Query sort index shapes
 */
/**
 * R
 */
interface IUserListUserIndexSet<R extends string = USER_LIST_USER_ATTRIBUTE_NAME_TYPE> {
  contacts_AZ: SideSortIndexType<R>;
}

interface IUserListContactIndexSet<R extends string = USER_LIST_CONTACT_ATTRIBUTE_NAME_TYPE> {
  contact_AZ: SideSortIndexType<R>;
}

/**
 * BA
 */
interface IUserListIndexSet {
  USER: IUserListUserIndexSet;
  CONTACT: IUserListContactIndexSet;
}

/**
 * Containers for names
 */
// SA
export const UNIT: IUnitAttributeNames = {
  roles: '_r',
};

/**
 * W
 */
export const KNOWN_IDS: IKnownIds = {
  CONFIGURATION: 'CFG',
};

/**
 * H
 */
export const UNIT_ROLE: NameSetType<IUnitRole, UNIT_ROLE_TYPE> = {
  CONFIGURATION: 'CFG',
  USER_LIST: 'UDL',
  USER: 'U',
  USER_SESSION: 'US',
  CONTACT: 'UC',
  // ADMINISTRATOR: 'ADMIN',
  // DESIGNER: 'DESIGNER',
};

/**
 * I
 */
export const USER_STATE_ENUM: NameSetType<IUserStateEnum, USER_STATE_ENUM_TYPE> = {
  active: 'active',
  ban: 'ban',
  old: 'old',
};

export const AUTHORIZATION_MODE_ENUM: NameSetType<IAuthorizationModeEnum, AUTHORIZATION_MODE_ENUM_TYPE> = {
  password: 'password',
  reset: 'reset',
  code: 'code',
};

export const CONTACT_TYPE_ENUM: NameSetType<IContactTypeEnum, CONTACT_TYPE_ENUM_TYPE> = {
  phone: 'phone',
  mobile: 'mobile',
  email: 'email',
  fkey: 'fkey',
};

export  const CONTACT_STATE_ENUM: NameSetType<IContactStateEnum, CONTACT_STATE_ENUM_TYPE> = {
  pending: 'pending',
  valid: 'valid',
  manual: 'manual',
};

/**
 * J
 */
export const CONFIGURATION: NameSetType<IConfigurationAttributeNames, CONFIGURATION_ATTRIBUTE_NAME_TYPE> = {
  smsConfirmationCodeMessage: 'cfg_sms_ccmsg',
  smsServiceId: 'cfg_sms_sid',
  smsSenderName: 'cfg_sms_sname',
};

// xxxx
export const USER_LIST: {} = {};

export  const USER: NameSetType<IUserAttributeNames, USER_ATTRIBUTE_NAME_TYPE> = {
  name: 'u_n',
  state: 'u_s',
  info: 'u_i',
};

export  const CONTACT: NameSetType<IContactAttributeNames, CONTACT_ATTRIBUTE_NAME_TYPE> = {
  value: 'uc_v',
};

/**
 * S
 */
export const USER_LIST_USER: NameSetType<IUserListUserAttributeNames, USER_LIST_USER_ATTRIBUTE_NAME_TYPE> = {
  primary: 'udl_u_p',
  mode: 'udl_u_m',
  // contacts band
  contacts: 'udl_u_cl',
  types: 'udl_u_tl',
  states: 'udl_u_sl',
};

export const USER_LIST_CONTACT: NameSetType<IUserListContactAttributeNames, USER_LIST_CONTACT_ATTRIBUTE_NAME_TYPE> = {
  value: 'udl_uc_v',
  type: 'udl_uc_t',
  code: 'udl_uc_c',
  codeGenTimestamp: 'udl_uc_cgts',
  codeGenPauseSpan: 'udl_uc_cgpsp',
};

/**
 * Y
 */
export  const IX_USER_LIST: IUserListIndexSet = {
  USER: {
    contacts_AZ: [{ key: USER_LIST_USER.contacts, order: AZ_ORDER }],
  },
  CONTACT: {
    contact_AZ: [{ key: USER_LIST_CONTACT.value, order: AZ_ORDER }],
  },
};

/**
 *
 *
 *
 */
/**
 * K
 */
class ReadEtaQuery extends BaseReadEtaQuery<UNIT_ROLE_TYPE> implements
  IConfigurationLinkTo,
  IUserListLinkTo,
  IUserLinkTo,
  IUserSessionLinkTo,
  IAdvSectionLinkTo,
  IAdvNodeLinkTo {

  USER(ids?: string | string[]): this {
    return this.yota('U', ids);
  }

  USER_LIST(ids?: string | string[]): this {
    return this.yota('UDL', ids);
  }

  CONTACT(ids?: string | string[]): this {
    return this.yota('UC', ids);
  }

}

export class CheckRoleQuery {

  static USER(id: string, roles: UNIT_ROLE_TYPE | UNIT_ROLE_TYPE[]): IQueryResult<IOmegaEta> {
    return new ReadEtaQuery('U', id, roles);
  }

}

/**
 * L
 */
export class ReadQuery {

  static CONFIGURATION(id: string = 'CFG'): ReadQueryForUnitType<IUnitDto & IConfigurationDto, IConfigurationLinkTo> {
    return new ReadEtaQuery('CFG', id);
  }

  static USER_LIST(id: string = 'CFG'): ReadQueryForUnitType<IUnitDto, IUserListLinkTo> {
    return new ReadEtaQuery('UDL', id);
  }

  static USER(id: string): ReadQueryForUnitType<IUnitDto & IUserDto, IUserLinkTo> {
    return new ReadEtaQuery('U', id);
  }
}

/**
 * Teta unit attributes shapes
 */
/**
 * M
 */
interface IConfigurationTetaAttributes extends ITetaAttributes<IConfigurationDto> {
  smsConfirmationCodeMessage: string;
  smsServiceId: string;
  smsSenderName: string;
}

interface IUserTetaAttributes extends ITetaAttributes<IUserDto> {
  name: string;
  state: USER_STATE_ENUM_TYPE;
  info: string;
}

interface IContactTetaAttributes extends ITetaAttributes<IContactDto> {
  value: string;
}

/**
 * Teta linkage attributes shapes
 */
/**
 * T
 */
interface IUserListUserTetaAttributes extends ITetaAttributes<IUserListUserDto> {
  primary: string[];
  mode: AUTHORIZATION_MODE_ENUM_TYPE;
  contacts: string[];
  types: CONTACT_TYPE_ENUM_TYPE[];
  states: CONTACT_STATE_ENUM_TYPE[];
}

interface IUserListContactTetaAttributes extends ITetaAttributes<IUserListContactDto> {
  value: string;
  type: CONTACT_TYPE_ENUM_TYPE;
  code: string;
  codeGenTimestamp: number;
  codeGenPauseSpan: number;
}

/**
 * Teta link-to shapes
 */

/**
 * Z
 */
interface ITetaUserListLinkTo {
  USER(): ITetaRo<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes, IUserListUserDto, IUserListUserTetaAttributes>;
  CONTACT(): ITetaRo<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes, IUserListContactDto, IUserListContactTetaAttributes>;
}

interface ITetaUserLinkTo {
  USER_LIST(): ITetaRo<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes, IUserListUserDto, IUserListUserTetaAttributes>;
}

interface ITetaContactLinkTo {
  USER_LIST(): ITetaRo<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes, IUserListContactDto, IUserListContactTetaAttributes>;
}

/**
 *
 */
/**
 * N
 */
class ConfigurationTetaAttributes extends TetaAttributes<IConfigurationDto> implements IConfigurationTetaAttributes {
  get smsConfirmationCodeMessage(): string { return this.getv('cfg_sms_ccmsg'); }
  set smsConfirmationCodeMessage(v: string) { this.setv('cfg_sms_ccmsg', v); }

  get smsServiceId(): string { return this.getv('cfg_sms_sid'); }
  set smsServiceId(v: string) { this.setv('cfg_sms_sid', v); }

  get smsSenderName(): string { return this.getv('cfg_sms_sname'); }
  set smsSenderName(v: string) { this.setv('cfg_sms_sname', v); }
}

class UserTetaAttributes extends TetaAttributes<IUserDto> implements IUserTetaAttributes {
  get name(): string { return this.getv('u_n'); }
  set name(v: string) { this.setv('u_n', v); }

  get state(): USER_STATE_ENUM_TYPE { return this.getv('u_s'); }
  set state(v: USER_STATE_ENUM_TYPE) { this.setv('u_s', v); }

  get info(): string { return this.getv('u_i'); }
  set info(v: string) { this.setv('u_i', v); }
}

class ContactTetaAttributes extends TetaAttributes<IContactDto> implements IContactTetaAttributes {
  get value(): string { return this.getv('uc_v'); }
  set value(v: string) { this.setv('uc_v', v); }
}

/**
 *
 */
/**
 * U
 */
class UserListUserTetaAttributes extends TetaAttributes<IUserListUserDto> implements IUserListUserTetaAttributes {
  get primary(): string[] { return this.getv('udl_u_p'); }
  set primary(v: string[]) { this.setv('udl_u_p', v); }

  get mode(): AUTHORIZATION_MODE_ENUM_TYPE { return this.getv('udl_u_m'); }
  set mode(v: AUTHORIZATION_MODE_ENUM_TYPE) { this.setv('udl_u_m', v); }

  get contacts(): string[] { return this.getv('udl_u_cl'); }
  set contacts(v: string[]) { this.setv('udl_u_cl', v); }

  get types(): CONTACT_TYPE_ENUM_TYPE[] { return this.getv('udl_u_tl'); }
  set types(v: CONTACT_TYPE_ENUM_TYPE[]) { this.setv('udl_u_tl', v); }

  get states(): CONTACT_STATE_ENUM_TYPE[] { return this.getv('udl_u_sl'); }
  set states(v: CONTACT_STATE_ENUM_TYPE[]) { this.setv('udl_u_sl', v); }
}

class UserListContactTetaAttributes extends TetaAttributes<IUserListContactDto> implements IUserListContactTetaAttributes {
  get value(): string { return this.getv('udl_uc_v'); }
  set value(v: string) { this.setv('udl_uc_v', v); }

  get type(): CONTACT_TYPE_ENUM_TYPE { return this.getv('udl_uc_t'); }
  set type(v: CONTACT_TYPE_ENUM_TYPE) { this.setv('udl_uc_t', v); }

  get code(): string { return this.getv('udl_uc_c'); }
  set code(v: string) { this.setv('udl_uc_c', v); }

  get codeGenTimestamp(): number { return this.getv('udl_uc_cgts'); }
  set codeGenTimestamp(v: number) { this.setv('udl_uc_cgts', v); }

  get codeGenPauseSpan(): number { return this.getv('udl_uc_cgpsp'); }
  set codeGenPauseSpan(v: number) { this.setv('udl_uc_cgpsp', v); }
}

/**
 * Teta Eta classes
 */

/**
 * AA
 */
class ConfigurationTetaEta extends TetaEta<UNIT_ROLE_TYPE, IConfigurationDto, IConfigurationTetaAttributes> {}

class UserListTetaEta extends TetaEta<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes> implements ITetaUserListLinkTo {
  USER(): ITetaRo<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes, IUserListUserDto, IUserListUserTetaAttributes> {
    return this.getRo('U');
  }

  CONTACT(): ITetaRo<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes, IUserListContactDto, IUserListContactTetaAttributes> {
    return this.getRo('UC');
  }
}

class UserTetaEta extends TetaEta<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes> implements ITetaUserLinkTo {
  USER_LIST(): ITetaRo<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes, IUserListUserDto, IUserListUserTetaAttributes> {
    return this.getRo('UDL');
  }
}

class ContactTetaEta extends TetaEta<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes> implements ITetaContactLinkTo {
  USER_LIST(): ITetaRo<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes, IUserListContactDto, IUserListContactTetaAttributes> {
    return this.getRo('UDL');
  }
}

/**
 * X
 */
// TODO: Split into different files???
// Unit defaults
const dConfiguration: IConfigurationDto = {
  cfg_sms_ccmsg: '',
  cfg_sms_sid: '',
  cfg_sms_sname: '',
};
const dUser: IUserDto = {
  u_n: '',
  u_s: 'active',
  u_i: '',
};
const dContact: IContactDto = {
  uc_v: '',
};
// Linkage defaults
/**
 * Y
 */
const dUserListUser: IUserListUserDto = {
  udl_u_p: [],
  udl_u_m: 'password',
  udl_u_cl: [],
  udl_u_tl: [],
  udl_u_sl: [],
};
const dUserListContact: IUserListContactDto = {
  udl_uc_v: '',
  udl_uc_t: 'phone',
  udl_uc_c: '',
  udl_uc_cgts: -1,
  udl_uc_cgpsp: 60 * 1000,
};

// Unit attributes
/**
 * CA
 */
const aConfiguration = new TetaAttributesFactory<IConfigurationDto, IConfigurationTetaAttributes>(ConfigurationTetaAttributes, dConfiguration);
const aUserList = new TetaAttributesFactory(TetaAttributes, {});
const aUser = new TetaAttributesFactory<IUserDto, IUserTetaAttributes>(UserTetaAttributes, dUser);
const aContact = new TetaAttributesFactory<IContactDto, IContactTetaAttributes>(ContactTetaAttributes, dContact);
// Linkage attributes
/**
 * DA
 */
const aUserListUser = new TetaAttributesFactory<IUserListUserDto, IUserListUserTetaAttributes>(UserListUserTetaAttributes, dUserListUser);
const aUserListContact = new TetaAttributesFactory<IUserListContactDto, IUserListContactTetaAttributes>(UserListContactTetaAttributes, dUserListContact);

// Zetas
/**
 * EA
 */
const zConfiguration = new TetaZetaFactory<UNIT_ROLE_TYPE, IConfigurationDto, IConfigurationTetaAttributes>(TetaZeta, 'CFG', aConfiguration);
const zUserList = new TetaZetaFactory<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes>(TetaZeta, 'UDL', aUserList);
const zUser = new TetaZetaFactory<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes>(TetaZeta, 'U', aUser);
const zContact = new TetaZetaFactory<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes>(TetaZeta, 'UC', aContact);

// Yotas
/**
 * FA
 */
// UserList ->
const yUserListUser = new TetaYotaFactory<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes, IUserListUserDto, IUserListUserTetaAttributes>(TetaYota, zUser, aUserListUser);
const yUserListContact = new TetaYotaFactory<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes, IUserListContactDto, IUserListContactTetaAttributes>(TetaYota, zContact, aUserListContact);
// User ->
const yUserUserList = new TetaYotaFactory<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes, IUserListUserDto, IUserListUserTetaAttributes>(TetaYota, zUserList, aUserListUser);
// Contact ->
const yContactUserList = new TetaYotaFactory<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes, IUserListContactDto, IUserListContactTetaAttributes>(TetaYota, zUserList, aUserListContact);

// Rocs
/**
 * GA
 */
const rocUserList: TetaRoFactoryIndexType<UNIT_ROLE_TYPE> = {
  U: new TetaRoFactory<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes, IUserListUserDto, IUserListUserTetaAttributes>(TetaRo, 'U', yUserListUser),
  UC: new TetaRoFactory<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes, IUserListContactDto, IUserListContactTetaAttributes>(TetaRo, 'UC', yUserListContact),
};

const rocUser: TetaRoFactoryIndexType<UNIT_ROLE_TYPE> = {
  UDL: new TetaRoFactory<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes, IUserListUserDto, IUserListUserTetaAttributes>(TetaRo, 'UDL', yUserUserList),
};

const rocContact: TetaRoFactoryIndexType<UNIT_ROLE_TYPE> = {
  UDL: new TetaRoFactory<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes, IUserListContactDto, IUserListContactTetaAttributes>(TetaRo, 'UDL', yContactUserList),
};

// Etas
/**
 * HA
 */
const eConfiguration = new TetaEtaFactory<UNIT_ROLE_TYPE, IConfigurationDto, IConfigurationTetaAttributes>(ConfigurationTetaEta, zConfiguration, {});
const eUserList = new TetaEtaFactory<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes>(UserListTetaEta, zUserList, rocUserList);
const eUser = new TetaEtaFactory<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes>(UserTetaEta, zUser, rocUser);
const eContact = new TetaEtaFactory<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes>(ContactTetaEta, zContact, rocContact);

/**
 * IA
 */
interface IBasisNewTetaContext extends ITetaContext {
  CONFIGURATION(u?: string): ITetaEta<UNIT_ROLE_TYPE, IConfigurationDto, IConfigurationTetaAttributes>;
  USER_LIST(u?: string): ITetaUserListLinkTo & ITetaEta<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes>;
  USER(u?: string): ITetaUserLinkTo & ITetaEta<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes>;
  CONTACT(u?: string): ITetaContactLinkTo & ITetaEta<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes>;
}

/**
 * JA
 */
interface IBasisTetaContext extends ITetaContext {
  readonly new: IBasisNewTetaContext;

  CONFIGURATION(eta: IEtaDto<UNIT_ROLE_TYPE, IConfigurationDto>): ITetaEta<UNIT_ROLE_TYPE, IConfigurationDto, IConfigurationTetaAttributes>;
  USER_LIST(eta: IEtaDto<UNIT_ROLE_TYPE, IAttributesDto>): ITetaUserListLinkTo & ITetaEta<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes>;
  USER(eta: IEtaDto<UNIT_ROLE_TYPE, IUserDto>): ITetaUserLinkTo & ITetaEta<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes>;
  CONTACT(eta: IEtaDto<UNIT_ROLE_TYPE, IContactDto>): ITetaContactLinkTo & ITetaEta<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes>;
}

/**
 * KA
 */
class BasisNewTetaContext implements IBasisNewTetaContext {

  private readonly _ctx: ITetaContext;

  constructor(ctx: ITetaContext) {
    this._ctx = ctx;
  }

  generateUnique(nelike: string): string {
    return this._ctx.generateUnique(nelike);
  }

  CONFIGURATION(u: string = 'CFG'): ITetaEta<UNIT_ROLE_TYPE, IConfigurationDto, IConfigurationTetaAttributes> {
    const eta: IEtaDto<UNIT_ROLE_TYPE, IConfigurationDto> = { z: { u, r: 'CFG' } };
    return eConfiguration.create(eta, this._ctx) as any;
  }

  USER_LIST(u: string = 'CFG'): ITetaUserListLinkTo & ITetaEta<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes> {
    const eta: IEtaDto<UNIT_ROLE_TYPE, IAttributesDto> = { z: { u, r: 'UDL' } };
    return eUserList.create(eta, this._ctx) as any;
  }

  USER(u?: string | undefined): ITetaUserLinkTo & ITetaEta<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes> {
    const eta: IEtaDto<UNIT_ROLE_TYPE, IUserDto> = { z: { u: isNil(u) ? Unique.generateNeLike() : u, r: 'U' } };
    return eUser.create(eta, this._ctx) as any;
  }

  CONTACT(u?: string | undefined): ITetaContactLinkTo & ITetaEta<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes> {
    const eta: IEtaDto<UNIT_ROLE_TYPE, IContactDto> = { z: { u: isNil(u) ? Unique.generateNeLike() : u, r: 'UC' } };
    return eContact.create(eta, this._ctx) as any;
  }
}

/**
 * LA
 */
class BasisTetaContext extends BaseTetaContext implements IBasisTetaContext {

  readonly new: IBasisNewTetaContext;

  constructor() {
    super();
    this.new = new BasisNewTetaContext(this);
  }

  CONFIGURATION(eta: IEtaDto<UNIT_ROLE_TYPE, IConfigurationDto>): ITetaEta<UNIT_ROLE_TYPE, IConfigurationDto, IConfigurationTetaAttributes> {
    return eConfiguration.create(eta, this);
  }

  USER_LIST(eta: IEtaDto<UNIT_ROLE_TYPE, IAttributesDto>): ITetaUserListLinkTo & ITetaEta<UNIT_ROLE_TYPE, IAttributesDto, IEmptyTetaAttributes> {
    return eUserList.create(eta, this) as any;
  }

  USER(eta: IEtaDto<UNIT_ROLE_TYPE, IUserDto>): ITetaUserLinkTo & ITetaEta<UNIT_ROLE_TYPE, IUserDto, IUserTetaAttributes> {
    return eUser.create(eta, this) as any;
  }

  CONTACT(eta: IEtaDto<UNIT_ROLE_TYPE, IContactDto>): ITetaContactLinkTo & ITetaEta<UNIT_ROLE_TYPE, IContactDto, IContactTetaAttributes> {
    return eContact.create(eta, this) as any;
  }
}

/**
 * MA
 */
export class Teta {
  static CreateContext(): IBasisTetaContext {
    return new BasisTetaContext();
  }
}
