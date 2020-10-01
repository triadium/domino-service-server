import { createParamDecorator } from '@nestjs/common';

export interface IContact {
  readonly ip: string;
  readonly ua: string;
}

// tslint:disable:variable-name

export const Contact = createParamDecorator((_, request) => {
  return { ip: request.ip, ua: request.get('user-agent') };
});

export const IP = createParamDecorator((_, request) => {
    return request.ip; // headers['x-forwarded-for'] || request.connection.remoteAddress;
});

export const UserAgent = createParamDecorator((_, request) => {
  return request.get('user-agent');
});

export const PiBox = createParamDecorator((_, request) => {
  return request.body.pi;
});

export const DeltaBox = createParamDecorator((_, request) => {
  return request.body.delta;
});

export const Cookies = createParamDecorator((_, request) => {
  return request.cookies;
});
