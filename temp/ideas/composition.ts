import { isNil, forOwn, forEach } from 'lodash';
type NE_TYPE = 'NE';
const NE: NE_TYPE = 'NE';

interface IAttributesDto {}

interface IZetaDto<R extends string, A extends IAttributesDto = IAttributesDto> {
  r: R | NE_TYPE;
  u: string;
  ar?: R[];
  a?: A;
}

interface IYotaDto<R extends string, U extends IAttributesDto = IAttributesDto, L extends IAttributesDto = IAttributesDto> {
  z: IZetaDto<R, U>;
  la?: L;
}

type RoDtoType<R extends string, U extends IAttributesDto = IAttributesDto, L extends IAttributesDto = IAttributesDto> = IYotaDto<R, U, L>[];
type RoDtoIndexType<R extends string> = {
  [key in R]: RoDtoType<R>
};
export interface IEtaDto<R extends string, U extends IAttributesDto = IAttributesDto> {
  z: IZetaDto<R, U>;
  roc?: RoDtoIndexType<R>;
}

interface IAttachable {
  isAttached(): boolean;
}

interface IDtoAccessor<D> {
  getDto(): D;
}

export interface ITetaAttributes extends IAttachable, IDtoAccessor<IAttributesDto> {
}

export interface ITetaNullZeta<R extends string> extends IDtoAccessor<IZetaDto<R>> {
  readonly role: R | NE_TYPE;
  readonly unique: string;
}

export interface ITetaZeta<R extends string, U extends ITetaAttributes> extends ITetaNullZeta<R> {
  readonly roles: R[];
  readonly attributes: U;
  formAttributes(): U;
  // takeAttributes(): U;
  // putAttributes(values: U): U;
  isNull(): boolean;
  // toNull(): ITetaNullZeta<R>;
}

export interface ITetaNullYota<R extends string> extends IAttachable, IDtoAccessor<IYotaDto<R>> {
  readonly zeta: ITetaNullZeta<R>;
}

export interface ITetaRefYota<R extends string> extends ITetaNullYota<R>, IDtoAccessor<IYotaDto<R>> {
  attributes: ITetaAttributes;
}

export interface ITetaYota<R extends string, U extends ITetaAttributes, L extends ITetaAttributes> extends IAttachable, IDtoAccessor<IYotaDto<R>> {
  readonly zeta: ITetaZeta<R, U>;
  readonly attributes: L;
  formAttributes(): L;
  // takeAttributes(): L;
  // putAttributes(values: L): L;
  isNull(): boolean;
  // toNull(): ITetaNullYota<R>;
  // toRef(): ITetaRefYota<R>;
}

export interface ITetaRo<R extends string, U extends ITetaAttributes, L extends ITetaAttributes> extends IAttachable, IDtoAccessor<RoDtoType<R>> {
  readonly name: R;
  readonly yotaCount: number;
  forEachYota(it: (yota: ITetaYota<R, U, L>, index: number) => void | boolean): void;
  forOneYota(index: number, one: (yota: ITetaYota<R, U, L>, index: number) => void): void;
  getYota(index: number): ITetaYota<R, U, L>;
  isEmpty(): boolean;

  appendNullYota(u: string, index?: number): ITetaYota<R, U, L>;
  appendYota(yota: ITetaYota<R, U, L>, index?: number): ITetaYota<R, U, L>;

  // takeYota(index: number): ITetaYota<R, U, L>;
  // replaceYota(index: number, yota: ITetaYota<R, U, L>): ITetaYota<R, U, L>;
  // removeYota(index: number): void;
  // clear(): void;

  // getYotaByKey(u: string): ITetaYota<R, U, L> | undefined;
}

export interface ITetaEta<R extends string, Z extends ITetaAttributes> extends IDtoAccessor<IEtaDto<R>> {
  readonly zeta: ITetaZeta<R, Z>;
  isNull(): boolean;
  forEachRo<U extends ITetaAttributes, L extends ITetaAttributes>(
    uctor: ITetaAttributesConstructor<U>,
    lctor: ITetaAttributesConstructor<L>,
    it: (ro: ITetaRo<R, U, L>, roname: R) => void | boolean
  ): void;
  getRo<U extends ITetaAttributes, L extends ITetaAttributes>(
    roname: R,
    uctor: ITetaAttributesConstructor<U>,
    lctor: ITetaAttributesConstructor<L>
  ): ITetaRo<R, U, L>;
  // takeRo<U extends ITetaAttributes, L extends ITetaAttributes>(
  //   roname: R,
  //   uctor: ITetaAttributesConstructor<U>,
  //   lctor: ITetaAttributesConstructor<L>
  // ): ITetaRo<R, U, L>;
  // putRo<U extends ITetaAttributes, L extends ITetaAttributes>(ro: ITetaRo<R, U, L>): ITetaRo<R, U, L>;
}

// export interface ITetaYotaAttributeValue {
//   setAttributeValue(ap: string | string[], v: any): void;
//   getAttributeValue(ap: string | string[]): any;
// }

interface ITetaContext {}

interface ITetaAttributesConstructor<A extends ITetaAttributes> {
  new (a: any, ctx?: ITetaContext): A
}

interface ITetaZetaConstructor<R extends string, U extends ITetaAttributes> {
  new (z: IZetaDto<R>, uctor: ITetaAttributesConstructor<U>, ctx?: ITetaContext): ITetaZeta<R, U>;
}

interface ITetaYotaConstructor<R extends string, U extends ITetaAttributes, L extends ITetaAttributes> {
  new (y: IYotaDto<R>, uctor: ITetaAttributesConstructor<U>, lctor: ITetaAttributesConstructor<L>, ctx?: ITetaContext): ITetaYota<R, U, L>;
}

interface ITetaRoConstructor<R extends string, U extends ITetaAttributes, L extends ITetaAttributes> {
  new (roname: R, ro: RoDtoType<R>, uctor: ITetaAttributesConstructor<U>, lctor: ITetaAttributesConstructor<L>, ctx?: ITetaContext): ITetaYota<R, U, L>;
}

interface ITetaEtaConstructor<R extends string, Z extends ITetaAttributes> {
  new (e: IEtaDto<R>, zctor: ITetaAttributesConstructor<Z>, ctx?: ITetaContext): ITetaEta<R, Z>;
}


/**
 *
 */
export class TetaAttributes<D> implements ITetaAttributes {

  protected _a: D;
  private _ctx?: ITetaContext;

  constructor(a: D, ctx?: ITetaContext) {
    this._a = a;
    this._ctx = ctx;
  }

  getDto(): IAttributesDto {
    return this._a;
  }

  isAttached(): boolean {
    return !isNil(this._ctx);
  }

}

export class TetaZeta<R extends string, U extends ITetaAttributes> implements ITetaZeta<R, U> {

  private _z: IZetaDto<R>;
  private _uctor: ITetaAttributesConstructor<U>;
  private _ctx?: ITetaContext;

  private _roles!: R[];
  private _attributes!: U;

  constructor(z: IZetaDto<R>, uctor: ITetaAttributesConstructor<U>, ctx?: ITetaContext) {
    this._z = z;
    this._uctor = uctor;
    this._ctx = ctx;
  }

  getDto(): IZetaDto<R> {
    return this._z;
  }

  get role(): R | NE_TYPE {
    return this._z.r;
  }

  get unique(): string {
    return this._z.u;
  }

  get roles(): R[] {
    if (isNil(this._roles)) {
      this._roles = this._z.r === NE ?
        (isNil(this._z.ar) ? [] : this._z.ar) :
        (isNil(this._z.ar) ? [this._z.r] : [this._z.r].concat(this._z.ar));
    }
    // else { exists }
    return this._roles;
  }

  get attributes(): U {
    if (isNil(this._attributes)) {
      if (isNil(this._z.a)) {
        throw new Error('Getting attributes from null zeta');
      }
      else {
        this._attributes = new this._uctor(this._z.a, this._ctx);
      }
    }
    // else { exists }
    return this._attributes;
  }

  formAttributes(): U {
    this._z.a = {};
    this._attributes = new this._uctor(this._z.a, this._ctx);
    return this._attributes;
  }

  isNull(): boolean {
    return this._z.r === NE || isNil(this._z.a);
  }
}

export class TetaYota<R extends string, U extends ITetaAttributes, L extends ITetaAttributes> implements ITetaYota<R, U, L> {
  private _y: IYotaDto<R>;
  private _uctor: ITetaAttributesConstructor<U>;
  private _lctor: ITetaAttributesConstructor<L>;
  private _ctx?: ITetaContext;

  private _zeta!: ITetaZeta<R, U>
  private _attributes!: L;

  constructor(y: IYotaDto<R>, uctor: ITetaAttributesConstructor<U>, lctor: ITetaAttributesConstructor<L>, ctx?: ITetaContext) {
    this._y = y;
    this._uctor = uctor;
    this._lctor = lctor;
    this._ctx = ctx;
  }

  getDto(): IYotaDto<R> {
    return this._y;
  }

  get zeta(): ITetaZeta<R, U> {
    if (isNil(this._zeta)) {
      this._zeta = new TetaZeta(this._y.z, this._uctor, this._ctx);
    }
    // else { exists }
    return this._zeta;
  }

  get attributes(): L {
    if (isNil(this._attributes)) {
      if (isNil(this._y.la)) {
        throw new Error('Getting attributes from null zeta');
      }
      else {
        this._attributes = new this._lctor(this._y.la, this._ctx);
      }
    }
    // else { exists }
    return this._attributes;
  }

  formAttributes(): L {
    this._y.la = {};
    this._attributes = new this._lctor(this._y.la, this._ctx);
    return this._attributes;
  }

  isAttached(): boolean {
    return !isNil(this._ctx);
  }

  isNull(): boolean {
    return isNil(this._y.la);
  }
}

export class TetaRo<R extends string, U extends ITetaAttributes, L extends ITetaAttributes> implements ITetaRo<R, U, L> {

  private _roname: R;
  private _ro: RoDtoType<R>;
  private _uctor: ITetaAttributesConstructor<U>;
  private _lctor: ITetaAttributesConstructor<L>;
  private _ctx?: ITetaContext;

  private _yotaCache: ITetaYota<R, U, L>[];
  private _allYotaCached: boolean;

  constructor(roname: R, ro: RoDtoType<R>, uctor: ITetaAttributesConstructor<U>, lctor: ITetaAttributesConstructor<L>, ctx?: ITetaContext) {
    this._roname = roname;
    this._ro = ro;
    this._uctor = uctor;
    this._lctor = lctor;
    this._ctx = ctx;

    this._yotaCache = [];
    this._yotaCache.length = this._ro.length;
    this._allYotaCached = false;
  }

  getDto(): RoDtoType<R> {
    return this._ro;
  }

  get name(): R {
    return this._roname;
  }

  get yotaCount(): number {
    return this._ro.length;
  }

  isEmpty(): boolean {
    return this.yotaCount === 0;
  }

  appendNullYota(u: string, index: number): ITetaYota<R, U, L> {
    const dto: IYotaDto<R> = { z: {r: this._roname, u } };
    const yota = new TetaYota(dto, this._uctor, this._lctor, this._ctx);
    return this.appendYota(yota, index);
  }

  appendYota(yota: ITetaYota<R, U, L>, index: number = -1): ITetaYota<R, U, L> {
    if(index < 0) {
      this._ro.push(yota.getDto());
      this._yotaCache.push(yota);
    }
    else{
      this._ro.splice(index, 0, yota.getDto());
      this._yotaCache.splice(index, 0, yota);
    }
    return yota;
  }

  isAttached(): boolean {
    return !isNil(this._ctx);
  }

  forEachYota(it: (yota: ITetaYota<R, U, L>, index: number) => void | boolean): void{
    if (this._allYotaCached) {
      forEach(this._yotaCache, it);
    }
    else{

      forEach(this._ro, (yotaDto: IYotaDto<R>, index: number): void | boolean => {
        const yota = this.getYota(index);
        return it(yota, index);
      });

      this._allYotaCached = true;
    }
  }

  forOneYota(index: number, one: (yota: ITetaYota<R, U, L>, index: number) => void): void {
    const yota = this.getYota(index);
    one(yota, index);
  }

  getYota(index: number): ITetaYota<R, U, L> {

    let yotaIndex;
    if(index >= 0 && index < this._ro.length){
      yotaIndex = index;
    }
    else if (index < 0 && (this._ro.length + index) >= 0) {
      yotaIndex = this._ro.length + index;
    }
    else{
      throw new Error('Yota index is out of range');
    }

    let yota = this._yotaCache[yotaIndex];

    if (isNil(yota)) {
      yota = new TetaYota(this._ro[yotaIndex], this._uctor, this._lctor, this._ctx);
      this._yotaCache[yotaIndex] = yota;
    }
    // else{ exists }

    return yota;
  }

}

type TetaRoIndexType<R extends string, U extends ITetaAttributes, L extends ITetaAttributes> =  { [key in string]: ITetaRo<R, U, L> };

export class TetaEta<R extends string, Z extends ITetaAttributes> implements ITetaEta<R, Z> {

  private _e: IEtaDto<R>;
  private _zctor: ITetaAttributesConstructor<Z>
  private _ctx?: ITetaContext;

  private _roCache: TetaRoIndexType<R, any, any>;
  private _zeta!: ITetaZeta<R, Z>;

  constructor(e: IEtaDto<R>, zctor: ITetaAttributesConstructor<Z>, ctx?: ITetaContext) {
    this._e = e;
    this._zctor = zctor;
    this._ctx = ctx;

    this._roCache = {};
  }

  getDto(): IEtaDto<R> {
    return this._e;
  }

  get zeta(): ITetaZeta<R, Z> {
    if (isNil(this._zeta)) {
      this._zeta = new TetaZeta(this._e.z, this._zctor, this._ctx);
    }
    // else { exists }
    return this._zeta;
  }

  isNull(): boolean {
    return this.zeta.isNull() && isNil(this._e.roc);
  }

  forEachRo<U extends ITetaAttributes, L extends ITetaAttributes>(
    uctor: ITetaAttributesConstructor<U>,
    lctor: ITetaAttributesConstructor<L>,
    it: (ro: ITetaRo<R, U, L>, roname: R) => void | boolean): void {

    forOwn(this._e.roc, (_: RoDtoType<R>, roname: any): void | boolean => {
      const ro = this.getRo<U, L>(roname, uctor, lctor);
      return it(ro, roname);
    });

  }

  getRo<U extends ITetaAttributes, L extends ITetaAttributes>(
    roname: R,
    uctor: ITetaAttributesConstructor<U>,
    lctor: ITetaAttributesConstructor<L>): ITetaRo<R, U, L> {
    let ro = this._roCache[roname];
    if (isNil(ro)) {

      if(this.isNull()) {
        throw new Error('Getting ro from null eta');
      }
      else{
        this._e.roc = isNil(this._e.roc) ? {} as RoDtoIndexType<R> : this._e.roc;

        let roDto = this._e.roc[roname];
        if(isNil(roDto)){
          roDto = [];
          this._e.roc[roname] = roDto;
        }
        // else{ exists }

        ro = new TetaRo(roname, roDto, uctor, lctor, this._ctx);
        this._roCache[roname] = ro;
        return ro;
      }

    }
    else {
      return ro;
    }
  }
}

/**
 *
 */

type USER_ATTRIBUTE_NAME_TYPE = 'u_n' | 'u_s' ;
type CONTACT_ATTRIBUTE_NAME_TYPE = 'c_v' | 'c_t' ;
type USER_LIST_USER_ATTRIBUTE_NAME_TYPE = 'udl_u_v' | 'udl_u_t' | 'udl_u_c' ;
type USER_LIST_CONTACT_ATTRIBUTE_NAME_TYPE = 'udl_c_v' | 'udl_c_t' | 'udl_c_s';


/**
 *
 */
interface IUserDto extends IAttributesDto {
  u_n: string;
  u_s: ['A', 'B'];
}

interface IContactDto extends IAttributesDto {
  c_v: string;
  c_t: ['M', 'T'];
}

interface IUserListUserDto extends IAttributesDto {
  udl_u_v: string;
  udl_u_t: ['C', 'D'];
  udl_u_c: number;
}

interface IUserListContactDto extends IAttributesDto {
  udl_c_v: string;
  udl_c_t: ['M', 'T'];
  udl_c_s: number;
}

/**
 *
 */
interface IUserTetaAttributes extends ITetaAttributes {
  name: string;
  state: ['A', 'B'];
}

interface IUserListUserTetaAttributes extends ITetaAttributes {
  value: string;
  type: ['C', 'D'];
  code: number;
}

interface IContactTetaAttributes extends ITetaAttributes {
  value: string;
  type: ['M', 'T'];
}

interface IUserListContactTetaAttributes extends ITetaAttributes {
  value: string;
  type: ['M', 'T'];
  state: number;
}

type ROLE_TYPE = 'UDL' | 'U' | 'CONTACT';

interface ITetaUserListLinkTo {
  USER(): ITetaRo<ROLE_TYPE, IUserTetaAttributes, IUserListUserTetaAttributes>;
  CONTACT(): ITetaRo<ROLE_TYPE, IContactTetaAttributes, IUserListContactTetaAttributes>;
}

/**
 *
 *
 */
class EmptyTetaAttributes extends TetaAttributes<{}> {}

class UserTetaAttributes extends TetaAttributes<IUserDto> implements IUserTetaAttributes {
  get name(): string { return this._a.u_n; }
  set name(v: string) { this._a.u_n = v; }

  get state(): ["A", "B"] { return this._a.u_s; }
  set state(v: ["A", "B"]) { this._a.u_s = v; }
}

class ContactTetaAttributes extends TetaAttributes<IContactDto> implements IContactTetaAttributes {
  get value(): string { return this._a.c_v; }
  set value(v: string) { this._a.c_v= v; }

  get type(): ["M", "T"] { return this._a.c_t; }
  set type(v: ["M", "T"]) { this._a.c_t = v; }
}

class UserListUserTetaAttributes extends TetaAttributes<IUserListUserDto> implements IUserListUserTetaAttributes {
  get value(): string { return this._a.udl_u_v; }
  set value(v: string) { this._a.udl_u_v = v; }

  get type(): ["C", "D"] { return this._a.udl_u_t; }
  set type(v: ["C", "D"]) { this._a.udl_u_t = v; }

  get code(): number { return this._a.udl_u_c; }
  set code(v: number) { this._a.udl_u_c = v; }
}

class UserListContactTetaAttributes extends TetaAttributes<IUserListContactDto> implements IUserListContactTetaAttributes {

  get value(): string { return this._a.udl_c_v; }
  set value(v: string) { this._a.udl_c_v = v; }

  get type(): ["M", "T"] { return this._a.udl_c_t; }
  set type(v: ["M", "T"]) { this._a.udl_c_t = v; }

  get state(): number { return this._a.udl_c_s; }
  set state(v: number) { this._a.udl_c_s = v; }
}

class UserListTetaEta extends TetaEta<ROLE_TYPE, EmptyTetaAttributes> implements ITetaUserListLinkTo {
  USER(): ITetaRo<ROLE_TYPE, IUserTetaAttributes, IUserListUserTetaAttributes> {
    return this.getRo('U', UserTetaAttributes, UserListUserTetaAttributes);
  }

  CONTACT(): ITetaRo<ROLE_TYPE, IContactTetaAttributes, IUserListContactTetaAttributes> {
    return this.getRo('CONTACT', ContactTetaAttributes, UserListContactTetaAttributes);
  }
}

export class Teta {

  protected static checkEtaRole(role: ROLE_TYPE,  eta: IEtaDto<ROLE_TYPE>): void | never {
    if(role !== eta.z.r) {
      throw new Error(`Eta role name ${eta.z.r} does not equal to ${role}`);
    }
    // else { ok }
  }

  static USER_LIST(eta: IEtaDto<ROLE_TYPE>): ITetaUserListLinkTo {
    this.checkEtaRole('UDL', eta);
    return new UserListTetaEta(eta, EmptyTetaAttributes, {});
  }
}


/**
 *
 *
 *
 */

const eta: IEtaDto<ROLE_TYPE> = {z:{r: 'UDL', u: 'LIST', a: {}}};

const ro$UserListContact = Teta.USER_LIST(eta).CONTACT();
console.log(ro$UserListContact.isAttached());
console.log(ro$UserListContact.isEmpty());
const yota$UserListContact_0 = ro$UserListContact.appendNullYota('A');
const attributes$UserListContact = yota$UserListContact_0.formAttributes();
attributes$UserListContact.state = 10;
attributes$UserListContact.type = ['M', 'T'];
attributes$UserListContact.value = "Some text";

console.log(yota$UserListContact_0.getDto());
console.log(ro$UserListContact.getDto());
console.log(eta);