import { IDto } from './dto-box.base';

export interface IDataBox {
  delta?: IDto;
  pi?: IDto;
}

export interface ICommandBox extends IDataBox {
  name: string;
}

export interface IResultBox extends IDataBox {
  ok: boolean;
  reason?: string;
  // time?: number;
}

type REASON_TYPE =
  | 'Unprocessable Entity'
  | 'Contact is already in use'
  | 'Invalid contact type';

type REASON_NAME_TYPE =
  | 'UNPROCESSABLE_ENTITY'
  | 'CONTACT_IN_USE'
  | 'INVALID_CONTACT_TYPE';

type ReasonIndexType = { [key in REASON_NAME_TYPE]: REASON_TYPE };

export const REASONS: ReasonIndexType = {
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  CONTACT_IN_USE: 'Contact is already in use',
  INVALID_CONTACT_TYPE: 'Invalid contact type',
};

export function reason(text: REASON_TYPE): IResultBox {
  return { ok: false, reason: text };
}

export function ok(delta?: any, pi?: any): IResultBox {
  return {ok: true, delta,  pi};
}