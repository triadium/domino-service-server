import { Processor, Command, Delta } from '../../common/decorators/unit.decorators';
import { IResultBox } from '../../common/bases/producer.base';

interface ISomeAbcDelta {
  a: string;
  b: number;
  c: string;
}

function ok(delta?: any, pi?: any): IResultBox {
  return {ok: true, delta,  pi};
}

@Processor('some')
export class SomeProcessor {

  @Command()
  list(){
    return ok(null, ['a', 'b', 'c']);
  }

  @Command('abc')
  abc(@Delta() d: ISomeAbcDelta){
    return ok(d, {a: d.a + ' ' + d.a, b: d.b * 3, c: d.c + d.c + d.c});
  }
}