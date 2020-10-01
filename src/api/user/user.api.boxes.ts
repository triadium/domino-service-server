import * as Joi from 'joi';
import { ValidationSchema, IDto, DtoBox } from '../../common/bases/dto-box.base';

/**
 * Interfaces for DTO of query parameters
 * and Joi validation schemas
 */

export interface IUserAuthorizeDto extends IDto {
  // Контакт (логин)
  contact: string;
  // Хэш пароля
  hash: string;
}

export interface IUserAuthorizeConfirmDto extends IDto {
  // Контакт (логин)
  contact: string;
  // Код подтверждения контакта
  code: string;
}

/**
 * Query parameters box shapes
 */

export interface IUserAuthorizeBox {
  contact: string;
  hash: string;
}

export interface IUserAuthorizeConfirmBox {
  contact: string;
  code: string;
}

// tslint:disable:max-classes-per-file

/**
 * Boxes for DTO of query parameters
 */
const joiEmail = Joi.string().min(3).max(320).email();
const joiMobile = Joi.string().regex(/^79\d{9}$/);

@ValidationSchema(Joi.object({
  contact: [joiEmail.required().error(new Error('Contact must be a valid email or mobile phone number')), joiMobile.required()],
  hash: Joi.string().min(4).max(512).required(),
}))
export class UserAuthorizeBox extends DtoBox<IUserAuthorizeDto> implements IUserAuthorizeBox {

  get contact(): string { return this.data.contact; }
  set contact(v: string) { this.data.contact = v; }

  get hash(): string { return this.data.hash; }
  set hash(v: string) { this.data.hash = v; }

}

@ValidationSchema(Joi.object({
  contact: [joiEmail.required().error(new Error('Contact must be a valid email or mobile phone number')), joiMobile.required()],
  code: Joi.string().min(4).max(16).required(),
}))
export class UserAuthorizeConfirmBox extends DtoBox<IUserAuthorizeConfirmDto> implements IUserAuthorizeConfirmBox {
  get contact(): string { return this.data.contact; }
  set contact(v: string) { this.data.contact = v; }

  get code(): string { return this.data.code; }
  set code(v: string) { this.data.code = v; }
}
