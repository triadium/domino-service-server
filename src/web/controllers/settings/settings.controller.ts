import { Controller, Get, Post, Delete, UseInterceptors, UnprocessableEntityException } from '@nestjs/common';
import { ReadProducer, WriteProducer } from '../../../common/producers';
import { LoggingInterceptor } from '../../../common/interceptors';
import { DtoValidationPipe } from '../../../common/pipes';
import { PiBox } from '../../../common/decorators';

import { IResultBox } from '../../../common/bases/api.types';
import { API_VERSION, SETTINGS, SMS_SERVICE } from '../../api.names';
import { COMMAND_SETTINGS_SMS_SERVICE_SAVE, COMMAND_SETTINGS_SMS_SERVICE_PICK } from '../../../unit/command.names';
import { SmsServiceSettingsBox } from '../../../api/settings';

@Controller(`${API_VERSION}${SETTINGS}`)
@UseInterceptors(LoggingInterceptor)
export class SettingsController {

  constructor(private readonly reader: ReadProducer, private readonly writer: WriteProducer) { }

  @Post(SMS_SERVICE)
  async postSmsServiceSettings(@PiBox(DtoValidationPipe) piBox: SmsServiceSettingsBox) {
    const r = await this.writer.perfromWithUid(COMMAND_SETTINGS_SMS_SERVICE_SAVE, SMS_SERVICE, { pi: piBox.data });
    if (!r.ok) {
      throw new UnprocessableEntityException(r.reason);
    }
    // else{ ok }
    return r;
  }

  @Get(SMS_SERVICE)
  async getSmsServiceSettings(): Promise<IResultBox> {
    const r = await this.reader.perfrom(COMMAND_SETTINGS_SMS_SERVICE_PICK);
    if (!r.ok) {
      throw new UnprocessableEntityException(r.reason);
    }
    // else{ ok }
    return r;
  }
}
