declare type KeyofTyped<Target, Type> = {
  [K in keyof Target]: Target[K] extends Type ? K : never;
}[keyof Target];
