import { isNil, isArray } from 'lodash';

/**
 *
 *
 *
 */

export function valuesToArray(values?: any | any[]): any[] | undefined {
  return isNil(values) ? undefined : isArray(values) ? values : [values];
}

/**
 * FIXME:
 *
 * Zeta - Unit data for Eta
 * r - Unit Role name
 * (Role name equals NE if requested role does not set for unit)
 * u - identifier of Unit
 * ar - all Unit Role names
 * (filled after checking and if requested role does not set for unit)
 * a - attributes of Unit
 *
 * Yota - union of peripheral Unit data and Linkage attributes
 * z - Unit data (central or peripheral) for Eta of current level
 * la - attributes of Linkage
 *
 * Ro - list of Yota for one Linkage Class
 *
 * Eta - union of central Unit data and set of Ro
 * roc - set of Ro (collection key is Unit Role name)
 *
 * Data not at root level can act in two roles at once -
 * Yota for current level and Eta for next level
 *
 * Null Zeta is Zeta with undefined attributes
 * Null Eta is Eta with Null Zeta and with undefined set of Ro
 * Null Yota is Yota with Null Zeta or with undefined attributes of Linkage
 * Ne Zeta is Zeta with Unit identifier equals to NE
 * Ne-Like Zeta is Zeta with Unit identifier equals to NE-LIKE value
 */

/** Nothing Elected */
export type NE_TYPE = 'NE';
export const NE: NE_TYPE = 'NE';
export const NE_PREFIX = 'NE:';

export interface IAttributesDto {}

export interface IZetaDto<R extends string, A extends IAttributesDto> {
  r: R | NE_TYPE;
  u: string;
  ar?: R[];
  a?: A;
}

export interface IYotaDto<R extends string, U extends IAttributesDto, L extends IAttributesDto> {
  z: IZetaDto<R, U>;
  la?: L;
}

export type RoDtoType<R extends string, U extends IAttributesDto, L extends IAttributesDto> = Array<
  IYotaDto<R, U, L>
>;

export type RoDtoIndexType<R extends string> = {
  [key in R]?: RoDtoType<R, IAttributesDto, IAttributesDto>
};

export interface IEtaDto<R extends string, U extends IAttributesDto> {
  z: IZetaDto<R, U>;
  roc?: RoDtoIndexType<R>;
}
