import { Controller, Get } from '@nestjs/common';
import { ReadProducer } from '../../common/producers/read-producer.provider';
import { WriteProducer } from '../../common/producers/write-producer.provider';

@Controller('some')
export class SomeController {

  constructor(private readonly reader: ReadProducer, private readonly writer: WriteProducer) {}

  @Get()
  findAll() {
    return this.reader.perfrom('/some');
  }

  @Get('abc')
  findAbc() {
    return this.reader.perfrom('/some/abc', { name: '', delta: {a: 'AAA', b: 10, c: 'CCC' }});
  }
}