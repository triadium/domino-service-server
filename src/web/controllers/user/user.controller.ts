import { Controller, Get, Post, Delete, UseInterceptors, UnprocessableEntityException } from '@nestjs/common';
import { ReadProducer, WriteProducer } from '../../../common/producers';
import { LoggingInterceptor } from '../../../common/interceptors';
import { DtoValidationPipe } from '../../../common/pipes';
import { PiBox } from '../../../common/decorators';

import { API_VERSION, USER, SIGN_IN } from '../../api.names';
import { COMMAND_USER_SIGN_IN } from '../../../unit/command.names';
import { UserAuthorizeBox } from '../../../api/user';

@Controller(`${API_VERSION}${USER}`)
@UseInterceptors(LoggingInterceptor)
export class UserController {

  constructor(private readonly reader: ReadProducer, private readonly writer: WriteProducer) { }

  @Post(SIGN_IN)
  async signIn(@PiBox(DtoValidationPipe) piBox: UserAuthorizeBox) {
    return await this.writer.perfromWithUid(COMMAND_USER_SIGN_IN, piBox.data.contact, { pi: piBox.data });
  }

  // @Get()
  // findAll() {
  //   return this.reader.perfrom('/some');
  // }

  // @Get('abc')
  // findAbc() {
  //   return this.reader.perfrom('/some/abc', { name: '', delta: {a: 'AAA', b: 10, c: 'CCC' }});
  // }
}