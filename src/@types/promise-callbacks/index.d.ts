declare module 'promise-callbacks' {

  interface Options {
    variadic: boolean | string[]
  }

  interface DeferredPromise<T> extends Promise<T> {
    defer(): (...args: any[]) => any;
  }

  function promisify(orig: Function, options?: Options): Function;
  function deferred(options?: Options): DeferredPromise<any>
}
