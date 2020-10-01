import { fork, ChildProcess } from 'child_process';
import { ReadUnitConfiguration } from '../common/configuration/read-unit.configuration';
import { WriteUnitConfiguration } from '../common/configuration/write-unit.configuration';
import { IUnitConfiguration } from '../common/bases/unit.configuration.base';
import { QueueList } from '../common/bases/queue-list.base';

interface IUnitListMap {
  [key: string]: ChildProcess[];
}

type UnitType = 'R' | 'W';

function createUnitWorker(queueName: string, index: number, concurrency: number, type: UnitType): ChildProcess {
  const worker = fork(__dirname + '/unit.worker', [], {
    env: {
      NODE_ENV: process.env.NODE_ENV,
      UNIT_QUEUE_NAME: queueName,
      UNIT_INDEX: index,
      UNIT_QUEUE_CONCURRENCY: concurrency,
      UNIT_TYPE: type,
    },
  });

  // DEBUG:
  // tslint:disable-next-line:no-console
  worker.on('message', (data) => console.log(data));

  return worker;
}

function startUnitWorkers(configuration: IUnitConfiguration, map: IUnitListMap, type: UnitType): void {
  const queueCount = configuration.get('UNIT_QUEUE_COUNT');
  const queuePrefix = configuration.get('UNIT_QUEUE_PREFIX');
  const unitCountForQueue = configuration.get('UNIT_COUNT_FOR_QUEUE');
  const queueConcurrency = configuration.get('UNIT_QUEUE_CONCURRENCY');
  for (let i = 0; i < queueCount; ++i) {
    const QUEUE_ID = QueueList.generateQueueName(queuePrefix, i);
    map[QUEUE_ID] = [];
    map[QUEUE_ID].length = unitCountForQueue;
    for (let j = 0; j < unitCountForQueue; ++j) {
      const instance = createUnitWorker(QUEUE_ID, j, queueConcurrency, type);
      map[QUEUE_ID][j] = instance;
    }
  }
}

const readUnitConfiguration = new ReadUnitConfiguration();
const writeUnitConfiguration = new WriteUnitConfiguration();

const unitListMap: IUnitListMap = {};

startUnitWorkers(readUnitConfiguration, unitListMap, 'R');
startUnitWorkers(writeUnitConfiguration, unitListMap, 'W');