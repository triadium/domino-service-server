declare module 'rand-token' {
  function uid(size: number):string;
  function suid(size: number, epoch: number, prefixLength: number):string;
  function generate(size: number, chars: string):string;

  export interface GeneratorOptions {
    source: 'default' | 'crypto' | 'math' | string | ((size: number) => Buffer);
    chars: 'default' | 'a-z' | 'alpha' | 'A-Z' | 'ALPHA' | '0-9' | 'numeric' | 'base32' | string;
  }

  function generator(options?: GeneratorOptions):string;
}