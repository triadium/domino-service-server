import * as isemail from 'isemail';
import { CONTACT_TYPE_ENUM_TYPE } from '../../storages/service/service.basis';

// RU
const rxMobile = /^79\d{9}$/;
const rxPhone = /^(?:7[348]\d{9})$|^(?:\d{6})$/;
const rxFKey = /^(?:ok|vk|mm)\d{1,16}$/;

export function getContactType(value: string): CONTACT_TYPE_ENUM_TYPE | undefined {
  rxMobile.lastIndex = -1;
  rxPhone.lastIndex = -1;
  rxFKey.lastIndex = -1;
  if (rxMobile.test(value)) {
    return 'mobile';
  }
  else if (rxPhone.test(value)) {
    return 'phone';
  }
  else if (isemail.validate(value)) {
    return 'email';
  }
  else if (rxFKey.test(value)) {
    return 'fkey';
  }
  else {
    return undefined;
  }
}