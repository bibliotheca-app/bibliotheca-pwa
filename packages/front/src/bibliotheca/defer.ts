export interface Deffered<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
}

export const defer = <T>(): Deffered<T> => {
  let resolve!: (value: T) => void;
  let reject!: (error: any) => void;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return { promise, resolve, reject };
};
