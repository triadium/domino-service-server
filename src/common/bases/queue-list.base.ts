import * as Queue from 'bee-queue';
import { QueueConfiguration } from '../configuration/queue.configuration.provider';

export interface IQueueList {
  select(index: number): Queue;
}

export class QueueList implements IQueueList {
  private readonly list: Queue[] = [];

  constructor(private readonly queueConfiguration: QueueConfiguration) {}

  static generateQueueName(prefix: string, index: number): string {
    return `${prefix}:${index}`;
  }

  static createQueue(name: string, settings: Queue.QueueSettings): Promise<Queue> {
    const queue = new Queue(name, settings);
    return new Promise<Queue>((resolve, reject) => {
      queue.on('ready', () => resolve(queue));
      queue.on('error', reject);
    });
  }

  static async createQueueList(count: number, prefix: string, settings: Queue.QueueSettings): Promise<Queue[]> {
    const list = [];
    list.length = count;
    // Step by step initilization
    for (let i = 0; i < count; ++i) {
      const name = QueueList.generateQueueName(prefix, i);
      list[i] = await QueueList.createQueue(name, settings);
    }
    return list;
  }

  /**
   * Initializes the list of queues for a producer
   * @param { number } queueCount Number of queues in the list
   * @param {string } queuePrefix Prefix for every queue name
   * @async
   */
  async setup(queueCount: number, queuePrefix: string): Promise<void> {
    const settings = this.queueConfiguration.generateSettings(false);
    const queueList = await QueueList.createQueueList(queueCount, queuePrefix, settings);
    this.list.length = queueList.length;
    for (let i = 0; i < queueList.length; ++i) {
     this.list[i] = queueList[i];
    }
  }

  select(index: number): Queue {
    if (index < 0 || index >= this.list.length) {
      return this.list[0];
    }
    else{
      return this.list[index];
    }
  }

}