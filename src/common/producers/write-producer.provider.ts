import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Producer } from '../bases/producer.base';
import { WriteQueueSelector } from '../queue-selectors/write-queue-selector.provider.1';
import { QueueConfiguration } from '../configuration/queue.configuration.provider';
import { IDataBox, IResultBox } from '../bases/api.types';

@Injectable()
export class WriteProducer extends Producer {
  constructor(selector: WriteQueueSelector, queueConfiguration: QueueConfiguration) {
    super(selector, queueConfiguration);
  }

  perfromWithUid<B extends IDataBox, R extends IResultBox>(name: string, uid: string, box?: B): Promise<R> {
    return super.perfromWithUid(name, uid, box).then(result => {
      if (result.ok) {
        return result as R;
      }
      else {
        throw new UnprocessableEntityException(result.reason);
      }
    });
  }

}