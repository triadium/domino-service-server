import * as Queue from 'bee-queue';
import * as redis from 'redis';
import * as lured from 'lured';
import { isNil } from 'lodash';
import { promisify, deferred } from 'promise-callbacks';
import { readFile } from 'fs';
import { IQueueList } from './queue-list.base';
import { QueueSelectorConfiguration } from './queue-selector.configuration.base';
import { RedisAccessConfiguration } from '../configuration/redis.access.configuration.provider';
import { join } from 'path';

export interface IQueueSelector {
  select(uid?: string): Promise<number>;
  selectQueue(uid?: string): Promise<Queue>;
  done(uid: string): Promise<number>;
}

export class QueueSelector implements IQueueSelector {
  private readonly client: redis.RedisClient;
  private lured?: lured.Lured;
  private readonly scripts: lured.Scripts = {};
  private uidQindexKey: string;
  private uidCountKey: string;
  private qindexKey: string;
  private qlimitKey: string;
  private scriptPath: string;

  constructor(private readonly queueList: IQueueList, configuration: QueueSelectorConfiguration, accessConfiguration: RedisAccessConfiguration) {
    const prefix = configuration.get('QUEUE_SELECTOR_PREFIX');
    this.scriptPath = join(process.cwd(), configuration.get('QUEUE_SELECTOR_SCRIPT_PATH'));

    this.uidQindexKey = `${prefix}:uid:qindex`;
    this.uidCountKey = `${prefix}:uid:count`;
    this.qindexKey = `${prefix}:qindex`;
    this.qlimitKey = `${prefix}:qlimit`;

    this.client = redis.createClient(accessConfiguration.generateSettings());
  }

  async setup(qlimit: number): Promise<void> {
    const readFileAsync = promisify(readFile);
    const scriptNames = ['setupQueueSelector', 'selectQueueIndex', 'selectQueueIndexByUid', 'reduceUidCounter'];

    const scriptTexts = await Promise.all(scriptNames.map(name => readFileAsync(join(this.scriptPath, `${name}.lua`), { encoding: 'utf8' })));
    scriptNames.forEach((name, index) => (this.scripts[name] = { script: scriptTexts[index], sha: '' }));

    this.lured = lured.create(this.client, this.scripts);
    const promise = deferred();
    this.lured.load(promise.defer());
    await promise;

    return this.setupInitialValues(0, qlimit);
  }

  private setupInitialValues(qindex: number, qlimit: number) {
    const promise = deferred();
    this.client.evalsha(this.scripts.setupQueueSelector.sha, 2, this.qindexKey, this.qlimitKey, qindex, qlimit, promise.defer());
    return promise;
  }

  select(uid?: string): Promise<number> {
    const promise = deferred();

    if (isNil(uid)) {
      this.client.evalsha(this.scripts.selectQueueIndex.sha, 2, this.qindexKey, this.qlimitKey, promise.defer());
    } else {
      this.client.evalsha(
        this.scripts.selectQueueIndexByUid.sha,
        4,
        this.uidQindexKey,
        this.uidCountKey,
        this.qindexKey,
        this.qlimitKey,
        uid,
        promise.defer(),
      );
    }

    return promise;
  }

  async selectQueue(uid?: string): Promise<Queue> {
    const index = await this.select(uid);
    return this.queueList.select(index);
  }

  done(uid: string): Promise<number> {
    const promise = deferred();
    this.client.evalsha(this.scripts.reduceUidCounter.sha, 2, this.uidQindexKey, this.uidCountKey, uid, promise.defer());
    return promise;
  }
}
