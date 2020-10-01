import { Injectable } from '@nestjs/common';
import { Producer } from '../bases/producer.base';
import { ReadQueueSelector } from '../queue-selectors/read-queue-selector.provider';
import { QueueConfiguration } from '../configuration/queue.configuration.provider';

@Injectable()
export class ReadProducer extends Producer {
  constructor(selector: ReadQueueSelector, queueConfiguration: QueueConfiguration){
    super(selector, queueConfiguration);
  }
}