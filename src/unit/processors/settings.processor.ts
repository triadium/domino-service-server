import { Processor, Command, Delta, Pi } from '../../common/decorators';
import { IResultBox, ok, reason, REASONS } from '../../common/bases/api.types';
import { IStorage } from '../../storages/storage.types';
import { MongoConnection } from '../../storages/mongo.connection.provider';
import { ReadQuery, UNIT_ROLE_TYPE, CONFIGURATION, Teta, IConfigurationDto } from '../../storages/service/service.basis';
import { API_VERSION, SETTINGS, SMS_SERVICE, SAVE, PICK } from '../command.names';
import { SmsServiceSettingsBox } from '../../api/settings';

@Processor(`${API_VERSION}${SETTINGS}`)
export class SettingsProcessor {
  private readonly _mainStorage: IStorage<UNIT_ROLE_TYPE>;

  constructor(connection: MongoConnection) {
    this._mainStorage = connection.MAIN_STORAGE();
  }

  @Command(`${SMS_SERVICE}${SAVE}`)
  async saveSmsService(@Pi() pi: SmsServiceSettingsBox): Promise<IResultBox> {
    const ctx = Teta.CreateContext();
    const teta = ctx.new.CONFIGURATION();
    const atts = teta.zeta.formAttributes();

    atts.smsConfirmationCodeMessage = pi.confirmationCodeMessage;
    atts.smsServiceId = pi.serviceId;
    atts.smsSenderName = pi.senderName;

    await this._mainStorage.write(teta);

    return ok();
  }

  @Command(`${SMS_SERVICE}${PICK}`)
  async pickSmsService()/*: Promise<IResultBox>*/ {
    // const pi = new SmsServiceSettingsBox();
    const w$SmsServiceSettings = ReadQuery.CONFIGURATION()
      .unit([CONFIGURATION.smsConfirmationCodeMessage, CONFIGURATION.smsServiceId, CONFIGURATION.smsSenderName])
      .genQueryEta();
    const eta = await this._mainStorage.read<IConfigurationDto>(w$SmsServiceSettings);
    const ctx = Teta.CreateContext();
    const teta = ctx.CONFIGURATION(eta);

    const atts = teta.zeta.attributes;
    const out = new SmsServiceSettingsBox();

    out.confirmationCodeMessage = atts.smsConfirmationCodeMessage;
    out.serviceId = atts.smsServiceId;
    out.senderName = atts.smsSenderName;

    return ok(null, out.data);
  }
}