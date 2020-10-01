
declare module 'lured' {

  import { RedisClient } from 'redis';

  interface Script {
    script: string;
    sha: string;
  }

  interface Scripts {
    [key: string]: Script;
  }

  type CallbackError = <E>(error: E, ...args: any[]) => void;

  interface Lured {
    load(cb: CallbackError): void;
    scripts: Scripts;
  }

  const CLOSED = 0;
  const CONNECTED = 1;
  const LOADING = 2;
  const READY = 3;

  function create(client: RedisClient, scripts: Scripts): Lured;
}
