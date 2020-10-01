import * as Joi from 'joi';
import { ValidationSchema, IDto, DtoBox } from '../../common/bases/dto-box.base';

/**
 * Interfaces for DTO of query parameters
 * and Joi validation schemas
 */

export interface ISmsServiceSettingsDto extends IDto {
  // Сообщение с кодом подтверждения
  ccmsg: string;
  // ID в SMS сервисе
  sid: string;
  // Имя отправителя SMS сообщений
  sname: string;
}

/**
 * Query parameters shapes
 */

export interface ISmsServiceSettingsBox {
  confirmationCodeMessage: string;
  serviceId: string;
  senderName: string;
}

// tslint:disable:max-classes-per-file

/**
 * Boxes for DTO of query parameters
 */

@ValidationSchema(Joi.object({
  ccmsg: Joi.string().allow(''),
  sid: Joi.string().allow(''),
  sname: Joi.string().allow(''),
}))
export class SmsServiceSettingsBox extends DtoBox<ISmsServiceSettingsDto> implements ISmsServiceSettingsBox {
  get confirmationCodeMessage(): string { return this.data.ccmsg; }
  set confirmationCodeMessage(v: string) { this.data.ccmsg = v; }

  get serviceId(): string { return this.data.sid; }
  set serviceId(v: string) { this.data.sid = v; }

  get senderName(): string { return this.data.sname; }
  set senderName(v: string) { this.data.sname = v; }
}