import { isNil } from 'lodash';
import { IQueueSelector } from './queue-selector.base';
import { QueueConfiguration } from '../configuration/queue.configuration.provider';
import { IDataBox, IResultBox, ICommandBox, reason } from './api.types';

export class Producer {
  constructor(private readonly selector: IQueueSelector, private readonly queueConfiguration: QueueConfiguration) {}

  perfrom<B extends IDataBox, R extends IResultBox>(name: string, box?: B): Promise<R> {
    return this.selector.selectQueue().then(nextQueue => {
      const jobData: ICommandBox = { name };

      if (!isNil(box)) {
        jobData.delta = box.delta;
        jobData.pi = box.pi;
      }
      // else { no data }

      const job = nextQueue.createJob(jobData).timeout(this.queueConfiguration.get('QUEUE_JOB_TIMEOUT'));
      const promise = new Promise<R>((resolve, reject) => {
        job.on('succeeded', (result: any) => {
          resolve(result);
        });
        job.on('failed', err => {
          // `Job ${job.id} queue ${job.queue.name} failed ${err.message}`
          reject(err);
        });
      });
      job.save();
      return promise;
    });
  }

  perfromWithUid<B extends IDataBox, R extends IResultBox>(name: string, uid: string, box?: B): Promise<R> {
    return this.selector.selectQueue(uid).then(nextQueue => {
      const jobData: ICommandBox = { name };

      if (!isNil(box)) {
        jobData.delta = box.delta;
        jobData.pi = box.pi;
      }
      // else { no data }

      const job = nextQueue.createJob(jobData).timeout(this.queueConfiguration.get('QUEUE_JOB_TIMEOUT'));
      const promise = new Promise<R>((resolve, reject) => {
        job.on('succeeded', (result: any) => {
          resolve(result);
          this.selector.done(uid);
        });
        job.on('failed', err => {
          this.selector.done(uid);
          // console.log(`Job ${job.id} queue ${job.queue.name} failed ${err.message}`);
          reject(err);
        });
      });
      job.save();
      return promise;
    });
  }
}
