import { Observable } from 'rxjs';

export function toAsyncIterator<T>(observable: Observable<T>): AsyncIterableIterator<T> {
  let error: Nullish<unknown> = null;
  let completed = false;

  const queue: Array<T> = [];
  const waiting: Array<(result: IteratorResult<T>) => void> = [];

  const subscription = observable.subscribe({
    next(value) {
      if (waiting.length) {
        waiting.shift()!({ value, done: false });
      } else {
        queue.push(value);
      }
    },
    error(err) {
      error = err;
      completed = true;
      for (const resolve of waiting) {
        resolve({ value: undefined, done: true });
      }
    },
    complete() {
      completed = true;
      for (const resolve of waiting) {
        resolve({ value: undefined, done: true });
      }
    }
  });

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next(): Promise<IteratorResult<T>> {
      if (error) {
        return Promise.reject(error as Error);
      }

      if (queue.length) {
        return Promise.resolve({ value: queue.shift()!, done: false });
      }

      if (completed) {
        return Promise.resolve({ value: undefined, done: true });
      }

      return new Promise((resolve) => waiting.push(resolve));
    },
    return(): Promise<IteratorResult<T>> {
      subscription.unsubscribe();

      return Promise.resolve({ value: undefined, done: true });
    },
    throw(e: unknown): Promise<IteratorResult<T>> {
      subscription.unsubscribe();

      return Promise.reject(e);
    }
  };
}
