export const API_VERSION = '/api';

export const SETTINGS = '/settings';
export const SMS_SERVICE = '/sms-service';
export const USER = '/user';

export const SIGN_IN = '/sign-in';
export const CONFIRM = '/confirm';
export const LOG_IN = '/log-in';
export const RESTORE = '/restore';

export const USER_SIGN_IN = `${USER}${SIGN_IN}`;
export const USER_SIGN_IN_CONFIRM = `${USER}${SIGN_IN}${CONFIRM}`;
export const USER_LOG_IN = `${USER}${LOG_IN}`;
export const USER_RESTORE = `${USER}${RESTORE}`;
export const USER_RESTORE_CONFIRM = `${USER}${RESTORE}${CONFIRM}`;

export const SETTINGS_SMS_SERVICE = `${SETTINGS}${SMS_SERVICE}`;