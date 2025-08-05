import { EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { toAsyncIterator } from '~/utils/misc/to-async-iterator';

describe('toAsyncIterator', () => {
  test('should iterate values from a finite observable', async () => {
    const values = [1, 2, 3];
    const obs = of(...values);
    const iter = toAsyncIterator(obs);

    const result: number[] = [];
    for await (const v of iter) {
      result.push(v);
    }

    expect(result).toEqual(values);
  });

  test('should complete immediately for EMPTY observable', async () => {
    const obs = EMPTY;
    const iter = toAsyncIterator(obs);
    const res = await iter.next();
    expect(res).toEqual({ value: undefined, done: true });
  });

  test('should propagate errors from the observable', async () => {
    const errorMessage = 'test error';
    const obs = throwError(() => new Error(errorMessage));
    const iter = toAsyncIterator(obs);
    await expect(iter.next()).rejects.toThrow(errorMessage);
  });

  test('should unsubscribe when return() is called', async () => {
    const subj = new Subject<number>();
    let unsubscribed = false;
    const obs = new Observable<number>((subscriber) => {
      const sub = subj.subscribe(subscriber);

      return () => {
        unsubscribed = true;
        sub.unsubscribe();
      };
    });

    const iter = toAsyncIterator(obs);
    // emit first value
    subj.next(42);
    const first = await iter.next();
    expect(first).toEqual({ value: 42, done: false });

    // call return to trigger unsubscribe
    const ret = await iter.return?.();
    expect(ret).toEqual({ value: undefined, done: true });
    expect(unsubscribed).toBe(true);
  });

  test('should handle multiple next() calls until completion', async () => {
    const obs: Observable<string> = of('a', 'b');
    const iter = toAsyncIterator(obs);

    const first = await iter.next();
    expect(first).toEqual({ value: 'a', done: false });

    const second = await iter.next();
    expect(second).toEqual({ value: 'b', done: false });

    const third = await iter.next();
    expect(third).toEqual({ value: undefined, done: true });
  });
});
