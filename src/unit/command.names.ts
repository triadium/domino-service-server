export const API_VERSION = '/api';

export const SETTINGS = '/settings';
export const USER = '/user';
export const SMS_SERVICE = '/sms-service';

export const PICK = '/pick';
export const SAVE = '/save';
export const REMOVE = '/remove';

export const SIGN_IN = '/sign-in';
export const CONFIRM = '/confirm';
export const LOG_IN = '/log-in';
export const RESTORE = '/restore';

export const COMMAND_SETTINGS_SMS_SERVICE_PICK = `${API_VERSION}${SETTINGS}${SMS_SERVICE}${PICK}`;
export const COMMAND_SETTINGS_SMS_SERVICE_SAVE = `${API_VERSION}${SETTINGS}${SMS_SERVICE}${SAVE}`;

export const COMMAND_USER_SIGN_IN = `${API_VERSION}${USER}${SIGN_IN}`;
export const COMMAND_USER_SIGN_IN_CONFIRM = `${API_VERSION}${USER}${SIGN_IN}${CONFIRM}`;
export const COMMAND_USER_LOG_IN = `${API_VERSION}${USER}${LOG_IN}`;
export const COMMAND_USER_RESTORE = `${API_VERSION}${USER}${RESTORE}`;
export const COMMAND_USER_RESTORE_CONFIRM = `${API_VERSION}${USER}${RESTORE}${CONFIRM}`;