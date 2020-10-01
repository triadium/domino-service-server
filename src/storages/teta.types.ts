import { isNil, forEach, forOwn, assign, cloneDeep, isEmpty } from 'lodash';
import { IAttributesDto, IZetaDto, IYotaDto, RoDtoType, IEtaDto, NE_TYPE, NE, RoDtoIndexType } from './common.query.types';
import Unique from './unique.attribute';

interface IAttachable {
  isAttached(): boolean;
  detach(): this;
  attach(ctx?: ITetaContext): this;
}

interface IDtoGenerator<D extends IAttributesDto> {
  genDto(delta: boolean): D;
}

interface IDtoDefaults<D extends IAttributesDto> {
  getDefaults(): D;
}

export interface ITetaAttributes<D extends IAttributesDto> extends IAttachable, IDtoGenerator<D>, IDtoDefaults<D> {
}

export interface IEmptyTetaAttributes extends ITetaAttributes<IAttributesDto> { }

export interface ITetaNullZeta<R extends string, D extends IAttributesDto = IAttributesDto> extends IAttachable, IDtoGenerator<IZetaDto<R, D>> {
  readonly role: R | NE_TYPE;
  readonly unique: string;
  setUnique(u: string): void;
}

export interface ITetaZeta<R extends string, D extends IAttributesDto, U extends ITetaAttributes<D>> extends ITetaNullZeta<R, D>, IDtoDefaults<D> {
  readonly roles: R[];
  readonly attributes: U;
  formAttributes(): U;
  takeAttributes(): U;
  putAttributes(values: U): U;
  cloneAttributes(): U;
  isNull(): boolean;
  // toNull(): ITetaNullZeta<R>;
}

export interface ITetaNullYota<R extends string> extends IAttachable, IDtoGenerator<IYotaDto<R, IAttributesDto, IAttributesDto>> {
  readonly zeta: ITetaNullZeta<R>;
}

export interface ITetaRefYota<R extends string> extends ITetaNullYota<R>, IDtoGenerator<IYotaDto<R, IAttributesDto, IAttributesDto>> {
  attributes: IEmptyTetaAttributes;
}

export interface ITetaYota<
  R extends string,
  UD extends IAttributesDto,
  U extends ITetaAttributes<UD>,
  LD extends IAttributesDto,
  L extends ITetaAttributes<LD>
> extends IAttachable, IDtoGenerator<IYotaDto<R, UD, LD>>, IDtoDefaults<LD> {
  readonly zeta: ITetaZeta<R, UD, U>;
  readonly attributes: L;
  formAttributes(): L;
  takeAttributes(): L;
  putAttributes(values: L): L;
  cloneAttributes(): L;
  // turnIntoEta(): ITetaEta<R, UD, U>;
  isNull(): boolean;
  // toNull(): ITetaNullYota<R>;
  // toRef(): ITetaRefYota<R>;
}

export interface ITetaRo<
  R extends string,
  UD extends IAttributesDto,
  U extends ITetaAttributes<UD>,
  LD extends IAttributesDto,
  L extends ITetaAttributes<LD>
> extends IAttachable, IDtoGenerator<RoDtoType<R, UD, LD>> {
  readonly name: R;
  readonly yotaCount: number;
  forEachYota(it: (yota: ITetaYota<R, UD, U, LD, L>, index: number) => void | boolean): void;
  forOneYota(index: number, one: (yota: ITetaYota<R, UD, U, LD, L>, index: number) => void): void;
  getYota(index: number): ITetaYota<R, UD, U, LD, L>;
  isEmpty(): boolean;

  appendNullYota(u?: string, index?: number): ITetaYota<R, UD, U, LD, L>;
  appendYota(yota: ITetaYota<R, UD, U, LD, L>, index?: number): ITetaYota<R, UD, U, LD, L>;

  takeYota(index: number): ITetaYota<R, UD, U, LD, L>;
  // replaceYota(index: number, yota: ITetaYota<R, UD, U, LD, L>): ITetaYota<R, UD, U, LD, L>;
  removeYota(index: number): void;
  // clear(): void;

  // getYotaByKey(u: string): ITetaYota<R, UD, U, LD, L> | undefined;
}

export interface ITetaEta<R extends string, D extends IAttributesDto, Z extends ITetaAttributes<D>> extends IDtoGenerator<IEtaDto<R, D>> {
  readonly context: ITetaContext;
  readonly zeta: ITetaZeta<R, D, Z>;
  isNull(): boolean;
  forEachRo<UD extends IAttributesDto, U extends ITetaAttributes<UD>, LD extends IAttributesDto, L extends ITetaAttributes<LD>>(
    it: (ro: ITetaRo<R, UD, U, LD, L>, roname: R) => void | boolean,
  ): void;
  getRo<UD extends IAttributesDto, U extends ITetaAttributes<UD>, LD extends IAttributesDto, L extends ITetaAttributes<LD>>(
    roname: R,
  ): ITetaRo<R, UD, U, LD, L>;

  // takeRo<UD extends IAttributesDto, U extends ITetaAttributes<UD>, LD extends IAttributesDto, L extends ITetaAttributes<LD>>(
  //   roname: R,
  // ): ITetaRo<R, UD, U, LD, L>;
  // putRo<UD extends IAttributesDto, U extends ITetaAttributes<UD>, LD extends IAttributesDto, L extends ITetaAttributes<LD>>(
  //  ro: ITetaRo<R, UD, U, LD, L>): ITetaRo<R, UD, U, LD, L>;
}

// export interface ITetaYotaAttributeValue {
//   setAttributeValue(ap: string | string[], v: any): void;
//   getAttributeValue(ap: string | string[]): any;
// }

export interface ITetaContext {
  generateUnique(nelike: string): string;
  // createEtaFromYota(): ITetaEta<R, D, Z>;
}

// FIXME: factory to reduce number of references
interface ITetaAttributesFactory<D extends IAttributesDto, A extends ITetaAttributes<D>> {
  readonly defaults: D;
  create(o?: D, ctx?: ITetaContext): A;
}

interface ITetaZetaFactory<R extends string, D extends IAttributesDto, U extends ITetaAttributes<D>> {
  readonly role: R | NE_TYPE;
  readonly defaults: D;
  create(unique: string, o?: D, role?: R | NE_TYPE, roles?: R[], ctx?: ITetaContext): ITetaZeta<R, D, U>;
}

interface ITetaYotaFactory<
  R extends string,
  UD extends IAttributesDto,
  U extends ITetaAttributes<UD>,
  LD extends IAttributesDto,
  L extends ITetaAttributes<LD>> {
    create(unique: string, uo?: UD, lo?: LD, ctx?: ITetaContext): ITetaYota<R, UD, U, LD, L>;
}

interface ITetaRoFactory<
  R extends string,
  UD extends IAttributesDto,
  U extends ITetaAttributes<UD>,
  LD extends IAttributesDto,
  L extends ITetaAttributes<LD>> {
    create(ro: RoDtoType<R, UD, LD>, ctx?: ITetaContext): ITetaRo<R, UD, U, LD, L>;
}

export type TetaRoFactoryIndexType<R extends string> = {
  [key in R]?: ITetaRoFactory<R, IAttributesDto, IEmptyTetaAttributes, IAttributesDto, IEmptyTetaAttributes>;
};

interface ITetaEtaFactory<R extends string, D extends IAttributesDto, Z extends ITetaAttributes<D>> {
  create(e: IEtaDto<R, D>, ctx?: ITetaContext): ITetaEta<R, D, Z>;
}

// type TetaEtaFactoryIndexType<R extends string> = {
//   [key in R]: ITetaEtaFactory<R, IAttributesDto, IEmptyTetaAttributes>;
// };

interface ITetaAttributesConstructor<D extends IAttributesDto, A extends ITetaAttributes<D>> {
  new (d: D, o?: D, ctx?: ITetaContext): A;
}

interface ITetaZetaConstructor<R extends string, D extends IAttributesDto, U extends ITetaAttributes<D>> {
  new (uf: ITetaAttributesFactory<D, U>, role: R | NE_TYPE, unique: string, o?: D, roles?: R[], ctx?: ITetaContext): ITetaZeta<R, D, U>;
}

interface ITetaYotaConstructor<
  R extends string,
  UD extends IAttributesDto,
  U extends ITetaAttributes<UD>,
  LD extends IAttributesDto,
  L extends ITetaAttributes<LD>
  > {
  new(
    zf: ITetaZetaFactory<R, UD, U>,
    lf: ITetaAttributesFactory<LD, L>,
    unique: string,
    uo?: UD, lo?: LD,
    ctx?: ITetaContext): ITetaYota<R, UD, U, LD, L>;
}

interface ITetaRoConstructor<
  R extends string,
  UD extends IAttributesDto,
  U extends ITetaAttributes<UD>,
  LD extends IAttributesDto,
  L extends ITetaAttributes<LD>
> {
  new (
    yf: ITetaYotaFactory<R, UD, U, LD, L>,
    name: R,
    ro: RoDtoType<R, UD, LD>,
    ctx?: ITetaContext): ITetaRo<R, UD, U, LD, L>;
}

interface ITetaEtaConstructor<R extends string, D extends IAttributesDto, Z extends ITetaAttributes<D>> {
  new (zf: ITetaZetaFactory<R, D, Z>, yfi: TetaRoFactoryIndexType<R>, e: IEtaDto<R, D>, ctx?: ITetaContext): ITetaEta<R, D, Z>;
}

export interface IEmptyTetaAttributes extends ITetaAttributes<IAttributesDto> {}

// tslint:disable:max-classes-per-file

/**
 * Teta classes for data manipulation of eta's structures
 */

// TODO: Check for context before attaching or appending
// TODO: check input data integrity

/**
 * TetaAttributes stores a reference to the instance of the attributes directly
 * as original data and external change will be reflected on attributes' functions
 */
export class TetaAttributes<D extends IAttributesDto> implements ITetaAttributes<D> {
  /* Default values */
  protected readonly _d: D;

  /* Origin data */
  protected _o?: D;
  protected _isNew: boolean;
  /* Modified data */
  protected _m: D;
  private _ctx?: ITetaContext;

  constructor(d: D, o?: D, ctx?: ITetaContext) {
    this._d = d;
    this._o = o;
    this._isNew = isNil(this._o);
    this._m = {} as D;
    this._ctx = ctx;
  }

  genDto(delta: boolean = false): D {
    if (delta) {
      // FIXME: check equalities to reduce more
      return cloneDeep(this._m);
    } else {
      return assign({}, cloneDeep(this._o), cloneDeep(this._m));
    }
  }

  getDefaults(): D {
    return this._d;
  }

  isAttached(): boolean {
    return !isNil(this._ctx);
  }

  detach(): this {
    this._ctx = undefined;
    return this;
  }

  attach(ctx?: ITetaContext): this {
    if (isNil(this._ctx)) {
      this._ctx = isNil(ctx) ? this._ctx : ctx;
      return this;
    }
    else {
      throw new Error('Attributes already attached');
    }
  }

  protected getv<K extends keyof D>(name: K) {
    const value = this._m[name];
    return isNil(value) ? (this._isNew ? value : this._o![name]) : value;
  }

  protected setv<K extends keyof D>(name: K, value: D[K]): void {
    if (!isNil(value)) {
      this._m[name] = value;
    }
    // else { skip }
  }
}

/**
 * TetaZeta
 */
export class TetaZeta<R extends string, D extends IAttributesDto, U extends ITetaAttributes<D>> implements ITetaZeta<R, D, U> {

  /* Role for unit */
  private _r: R | NE_TYPE;
  /* Unique id of unit */
  private _u: string;
  /* Factory for unit attributes */
  private _af: ITetaAttributesFactory<D, U>;
  private _ctx?: ITetaContext;

  /* Role list for null zeta is empty, else it includes all assigned roles */
  private _ar!: R[];
  private _isAr: boolean;
  private _a!: U;

  constructor(uf: ITetaAttributesFactory<D, U>, role: R | NE_TYPE, unique: string, o?: D, roles?: R[], ctx?: ITetaContext) {
    this._af = uf;

    this._r = role;
    this._u = unique;

    this._ar = role === NE ? (isNil(roles) ? [] : roles) : (isNil(roles) ? [role] : roles);
    this._isAr = !isNil(roles);
    this._ctx = ctx;

    this._a = isNil(o) ? this._a : this._af.create(o, this._ctx);
  }

  genDto(delta: boolean = false): IZetaDto<R, D> {
    const zeta: IZetaDto<R, D> = {
      u: this._u,
      r: this._r,
      ar: this._isAr ? this._ar : undefined,
      a: this.isNull() ? undefined : this._a.genDto(delta),
    };
    return zeta;
  }

  getDefaults(): D {
    return this._af.defaults;
  }

  get role(): R | NE_TYPE {
    return this._r;
  }

  get unique(): string {
    return this._u;
  }

  setUnique(u: string): void {
    this._u = u;
  }

  get roles(): R[] {
    return this._ar;
  }

  get attributes(): U {
    return this._a;
  }

  formAttributes(): U {
    this._a = this._af.create(undefined, this._ctx);
    return this._a;
  }

  takeAttributes(): U {
    return /* isNil(this._a) ? this._a : */ this._a.detach();
  }

  putAttributes(values: U): U {
    if (!isNil(this._a)) {
      this._a.detach();
    }
    // else { noop }
    this._a = values.attach(this._ctx);
    return this._a;
  }

  isAttached(): boolean {
    return !isNil(this._ctx);
  }

  detach(): this {
    if (!isNil(this._a)) {
      this._a.detach();
    }
    // else { noop }
    this._ctx = undefined;
    return this;
  }

  attach(ctx?: ITetaContext): this {
    if (isNil(this._ctx)) {
      if (!isNil(ctx)) {
        this._ctx =  ctx;
        if (!isNil(this._a)) {
          this._a.attach(ctx);
        }
        // else { noop }
      }
      // else { noop }
      return this;
    }
    else {
      throw new Error('Zeta already attached');
    }
  }

  cloneAttributes(): U {
    const dto = this._a.genDto(false);
    return this._af.create(dto, this._ctx);
  }

  isNull(): boolean {
    return this._r === NE || isNil(this._a);
  }
}

export class TetaYota<
R extends string,
UD extends IAttributesDto,
U extends ITetaAttributes<UD>,
LD extends IAttributesDto,
L extends ITetaAttributes<LD>> implements ITetaYota<R, UD, U, LD, L> {

  /* Factory for linkage attributes */
  private _af: ITetaAttributesFactory<LD, L>;
  private _ctx?: ITetaContext;

  private readonly _z: ITetaZeta<R, UD, U>;
  private _a!: L;

  constructor(
    zf: ITetaZetaFactory<R, UD, U>,
    lf: ITetaAttributesFactory<LD, L>,
    unique: string,
    uo?: UD, lo?: LD,
    ctx?: ITetaContext) {
    this._z = zf.create(unique, uo, undefined, undefined, ctx);
    this._af = lf;
    this._ctx = ctx;

    this._a = isNil(lo) ? this._a : this._af.create(lo, this._ctx);
  }

  genDto(delta: boolean = false): IYotaDto<R, UD, LD> {
    const yota: IYotaDto<R, UD, LD> = {
      z: this._z.genDto(delta),
      la: this.isNull() ? undefined : this._a.genDto(delta),
    };
    return yota;
  }

  getDefaults(): LD {
    return this._af.defaults;
  }

  get zeta(): ITetaZeta<R, UD, U> {
    return this._z;
  }

  get attributes(): L {
    return this._a;
  }

  formAttributes(): L {
    this._a = this._af.create(undefined, this._ctx);
    return this._a;
  }

  takeAttributes(): L {
    return this._a.detach();
  }

  putAttributes(values: L): L {
    if (!isNil(this._a)) {
      this._a.detach();
    }
    // else { noop }
    this._a = values.attach(this._ctx);
    return this._a;
  }

  cloneAttributes(): L {
    const dto = this._a.genDto(false);
    return this._af.create(dto, this._ctx);
  }

  isAttached(): boolean {
    return !isNil(this._ctx);
  }

  detach(): this {
    this.zeta.detach();

    if (!isNil(this._a)) {
      this._a.detach();
    }
    // else { noop }
    this._ctx = undefined;
    return this;
  }

  attach(ctx?: ITetaContext): this {
    if (isNil(this._ctx)) {
      if (!isNil(ctx)) {
        this._ctx =  ctx;
        this.zeta.attach(ctx);
        if (!isNil(this._a)) {
          this._a.attach(ctx);
        }
        // else { noop }
      }
      // else { noop }
      return this;
    }
    else {
      throw new Error('Yota already attached');
    }
  }

  isNull(): boolean {
    return isNil(this._a);
  }
}

export class TetaRo<R extends string,
UD extends IAttributesDto,
U extends ITetaAttributes<UD>,
LD extends IAttributesDto,
L extends ITetaAttributes<LD>> implements ITetaRo<R, UD, U, LD, L> {

  private _n: R;
  private _ro: Array<ITetaYota<R, UD, U, LD, L>>;
  private _yf: ITetaYotaFactory<R, UD, U, LD, L>;
  private _ctx?: ITetaContext;

  constructor(yf: ITetaYotaFactory<R, UD, U, LD, L>, name: R, ro: RoDtoType<R, UD, LD>, ctx?: ITetaContext) {
    this._yf = yf;
    this._n = name;
    this._ctx = ctx;
    this._ro = [];
    if (!isEmpty(ro)) {
      this._ro.length = ro.length;
      forEach(ro, (v, i) => {
        this._ro[i] = this._yf.create(v.z.u, v.z.a, v.la, this._ctx);
      });
    }
    // else { skip }
  }

  genDto(delta: boolean = false): RoDtoType<R, UD, LD> {
    const outRo: RoDtoType<R, UD, LD> = [];
    outRo.length = this._ro.length;
    forEach(this._ro, (v, i) => {
      outRo[i] = v.genDto(delta);
    });
    return outRo;
  }

  get name(): R {
    return this._n;
  }

  get yotaCount(): number {
    return this._ro.length;
  }

  isEmpty(): boolean {
    return this._ro.length === 0;
  }

  appendNullYota(u?: string, index?: number): ITetaYota<R, UD, U, LD, L> {
    const yota = this._yf.create(isNil(u) ? Unique.generateNeLike() : u, undefined, undefined, this._ctx);
    return this.appendYota(yota, index);
  }

  appendYota(yota: ITetaYota<R, UD, U, LD, L>, index: number = -1): ITetaYota<R, UD, U, LD, L> {
    if (index < 0) {
      this._ro.push(yota);
    }
    else {
      this._ro.splice(index, 0, yota);
    }
    return yota;
  }

  isAttached(): boolean {
    return !isNil(this._ctx);
  }

  detach(): this {
    forEach(this._ro, (yota) => {
      yota.detach();
    });
    return this;
  }

  attach(ctx?: ITetaContext): this {
    if (isNil(this._ctx)) {
      if (!isNil(ctx)) {
        this._ctx = ctx;
        forEach(this._ro, (yota) => {
          yota.attach(ctx);
        });
      }
      // else { noop }
      return this;
    }
    else {
      throw new Error('Ro already attached');
    }
  }

  forEachYota(it: (yota: ITetaYota<R, UD, U, LD, L>, index: number) => void | boolean): void{
    forEach(this._ro, it);
  }

  forOneYota(index: number, one: (yota: ITetaYota<R, UD, U, LD, L>, index: number) => void): void {
    const yota = this.getYota(index);
    one(yota, index);
  }

  getYota(index: number): ITetaYota<R, UD, U, LD, L> {

    let yotaIndex;
    if (index >= 0 && index < this._ro.length) {
      yotaIndex = index;
    }
    else if (index < 0 && (this._ro.length + index) >= 0) {
      yotaIndex = this._ro.length + index;
    }
    else {
      throw new Error('Yota index is out of range');
    }

    return this._ro[yotaIndex];
  }

  takeYota(index: number): ITetaYota<R, UD, U, LD, L> {
    let yotaIndex;
    if (index >= 0 && index < this._ro.length) {
      yotaIndex = index;
    }
    else if (index < 0 && (this._ro.length + index) >= 0) {
      yotaIndex = this._ro.length + index;
    }
    else {
      throw new Error('Yota index is out of range');
    }
    const yota = this._ro[yotaIndex];
    this._ro.splice(yotaIndex, 1);
    return yota.detach();
  }

  removeYota(index: number): void {
    this.takeYota(index);
  }

}

type TetaRoIndexType<R extends string> = {
  [key in R]: ITetaRo<R, IAttributesDto, IEmptyTetaAttributes, IAttributesDto, IEmptyTetaAttributes>
};

export class TetaEta<R extends string, D extends IAttributesDto, Z extends ITetaAttributes<D>> implements ITetaEta<R, D, Z> {

  private readonly _z: ITetaZeta<R, D, Z>;
  private readonly _rofi: TetaRoFactoryIndexType<R>;
  private _roc?: Partial<TetaRoIndexType<R>>;
  private _ctx?: ITetaContext;

  constructor(zf: ITetaZetaFactory<R, D, Z>, rofi: TetaRoFactoryIndexType<R>, e: IEtaDto<R, D>, ctx?: ITetaContext) {
    this._z = zf.create(e.z.u, e.z.a, e.z.r, e.z.ar, ctx);
    this._rofi = rofi;
    this._ctx = ctx;

    if (!isEmpty(e.roc)) {
      this._roc = {};
      forOwn(e.roc!, (roDto, k) => {
        this._roc![k as R] = this._fillRo(k as R, roDto) as Partial<TetaRoIndexType<R>>[R];
      });
    }
    // else { skip }
  }

  genDto(delta: boolean = false): IEtaDto<R, D> {
    const outEta: IEtaDto<R, D> = {
      z: this._z.genDto(delta),
    };

    if (!isEmpty(this._roc)) {
      const outRoc: Partial<RoDtoIndexType<R>> = {};
      forOwn(this._roc!, (v, k) => {
        if (!isNil(v)) {
          outRoc[k as R] = v.genDto(delta) as Partial<RoDtoIndexType<R>>[R];
        }
        // else { skip }
      });
      if (!isEmpty(outRoc)) {
        outEta.roc = outRoc as RoDtoIndexType<R>;
      }
      // else { skip }
    }
    // else { skip }

    return outEta;
  }

  get context(): ITetaContext {
    return this._ctx!;
  }

  get zeta(): ITetaZeta<R, D, Z> {
    return this._z;
  }

  isNull(): boolean {
    return this.zeta.isNull() && isNil(this._roc);
  }

  forEachRo<UD extends IAttributesDto, U extends ITetaAttributes<UD>, LD extends IAttributesDto, L extends ITetaAttributes<LD>>(
    it: (ro: ITetaRo<R, UD, U, LD, L>, roname: R) => void | boolean,
  ): void {
    forOwn(this._roc, it as any);
  }

  getRo<UD extends IAttributesDto, U extends ITetaAttributes<UD>, LD extends IAttributesDto, L extends ITetaAttributes<LD>>(
    roname: R,
  ): ITetaRo<R, UD, U, LD, L> {

    if (isNil(this._roc)) {
      this._roc = {};
    }
    // else{ skip }

    let ro = this._roc[roname];
    if (isNil(ro)) {
      ro = this._fillRo(roname, []) as Partial<TetaRoIndexType<R>>[R];
      this._roc[roname] = ro;
    }
    // else { skip }

    return ro as any;
  }

  private _fillRo(
    roname: R,
    roDto?: RoDtoType<R, IAttributesDto, IAttributesDto>,
  ): ITetaRo<R, IAttributesDto, IEmptyTetaAttributes, IAttributesDto, IEmptyTetaAttributes> | undefined {
    const f = this._rofi[roname];
    if (isNil(f)) {
      throw new Error(`Eta ro name [${roname}] does not exist in linkage class set for role [${this._z.role}]`);
    }
    else if (!isNil(roDto)) {
      return f.create(roDto, this._ctx);
    }
    // else { skip }
  }
}

/**
 * Factories
 */

export class TetaAttributesFactory<D extends IAttributesDto, A extends ITetaAttributes<D>> implements ITetaAttributesFactory<D, A> {

  /* Default values */
  private readonly _d: D;
  /** Constructor */
  private readonly _ctor: ITetaAttributesConstructor<D, A>;

  constructor(uctor: ITetaAttributesConstructor<D, A>, d: D) {
    this._d = d;
    this._ctor = uctor;
  }

  get defaults(): D {
    return this._d;
  }

  create(o?: D, ctx?: ITetaContext): A {
    return new this._ctor(this._d, o, ctx);
  }
}

export class TetaZetaFactory<R extends string, D extends IAttributesDto, U extends ITetaAttributes<D>> implements ITetaZetaFactory<R, D, U> {
  private readonly _r: R | NE_TYPE;
  private readonly _uf: ITetaAttributesFactory<D, U>;
  private readonly _ctor: ITetaZetaConstructor<R, D, U>;

  constructor(zctor: ITetaZetaConstructor<R, D, U>, role: R | NE_TYPE, uf: ITetaAttributesFactory<D, U>) {
    this._r = role;
    this._uf = uf;
    this._ctor = zctor;
  }

  get role(): R | NE_TYPE {
    return this._r;
  }

  get defaults(): D {
    return this._uf.defaults;
  }

  create(unique: string, o?: D, role?: R | NE_TYPE, roles?: R[], ctx?: ITetaContext): ITetaZeta<R, D, U> {
    if (!isNil(role) && role !== NE && this._r !== role) {
      throw new Error(`Zeta role name [${role}] does not equal to factory's role [${this._r}]`);
    }
    else {
      return new this._ctor(this._uf, role === NE ? role : this._r, unique, o, roles, ctx);
    }
  }
}

export class TetaYotaFactory<
  R extends string,
  UD extends IAttributesDto,
  U extends ITetaAttributes<UD>,
  LD extends IAttributesDto,
  L extends ITetaAttributes<LD>> implements ITetaYotaFactory<R, UD, U, LD, L>
{

  private readonly _zf: ITetaZetaFactory<R, UD, U>;
  private readonly _lf: ITetaAttributesFactory<LD, L>;
  private readonly _ctor: ITetaYotaConstructor<R, UD, U, LD, L>;

  constructor(yctor: ITetaYotaConstructor<R, UD, U, LD, L>, zf: ITetaZetaFactory<R, UD, U>, lf: ITetaAttributesFactory<LD, L>) {
    this._zf = zf;
    this._lf = lf;
    this._ctor = yctor;
  }

  create(unique: string, uo?: UD, lo?: LD, ctx?: ITetaContext): ITetaYota<R, UD, U, LD, L> {
    return new this._ctor(this._zf, this._lf, unique, uo, lo, ctx);
  }
}

export class TetaRoFactory<
  R extends string,
  UD extends IAttributesDto,
  U extends ITetaAttributes<UD>,
  LD extends IAttributesDto,
  L extends ITetaAttributes<LD>> implements ITetaRoFactory<R, UD, U, LD, L>
{

  private _n: R;
  private readonly _yf: ITetaYotaFactory<R, UD, U, LD, L>;
  private readonly _ctor: ITetaRoConstructor<R, UD, U, LD, L>;

  constructor(roctor: ITetaRoConstructor<R, UD, U, LD, L>, name: R, yf: ITetaYotaFactory<R, UD, U, LD, L>) {
    this._n = name;
    this._yf = yf;
    this._ctor = roctor;
  }

  create(ro: RoDtoType<R, UD, LD>, ctx?: ITetaContext): ITetaRo<R, UD, U, LD, L> {
    return new this._ctor(this._yf, this._n, ro, ctx);
  }
}

export class TetaEtaFactory<R extends string, D extends IAttributesDto, Z extends ITetaAttributes<D>> implements ITetaEtaFactory<R, D, Z> {
  private readonly _zf: ITetaZetaFactory<R, D, Z>;
  private readonly _rofi: TetaRoFactoryIndexType<R>;
  private readonly _ctor: ITetaEtaConstructor<R, D, Z>;

  constructor(ector: ITetaEtaConstructor<R, D, Z>, zf: ITetaZetaFactory<R, D, Z>, yfi: TetaRoFactoryIndexType<R>) {
    this._zf = zf;
    this._rofi = yfi;
    this._ctor = ector;
  }

  create(e: IEtaDto<R, D>, ctx?: ITetaContext): ITetaEta<R, D, Z> {
    return new this._ctor(this._zf, this._rofi, e, ctx);
  }
}

export class BaseTetaContext implements ITetaContext {
  private readonly _uniqueIndex: Map<string, string>;

  constructor() {
    this._uniqueIndex = new Map();
  }

  generateUnique(nelike: string): string {
    let unique = this._uniqueIndex.get(nelike);
    if (isNil(unique)) {
      unique = Unique.generate();
      this._uniqueIndex.set(nelike, unique);
    }
    // else { noop }
    return unique;
  }
}