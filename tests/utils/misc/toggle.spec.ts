import { toggle } from '~/utils/misc/toggle';

describe('toggle', () => {
  test('Работает с примитивами', () => {
    expect(toggle([1, 2, 3], 1)).toEqual([2, 3]);
    expect(toggle([2, 3], 1)).toEqual([2, 3, 1]);
  });

  test('Работает с объектами и функцией isEqual', () => {
    type Data = { value: number };

    const isEqual = (a: Data, b: Data): boolean => a.value === b.value;
    const data = (value: number): Data => ({ value });

    expect(toggle([data(1), data(2), data(3)], data(1), { isEqual })).toEqual([data(2), data(3)]);
    expect(toggle([data(2), data(3)], data(1), { isEqual })).toEqual([data(2), data(3), data(1)]);
  });

  test('Контролируемое состояние и примитивы', () => {
    expect(toggle([1, 2, 3], 4, { state: true })).toEqual([1, 2, 3, 4]);
    expect(toggle([1, 2, 3], 1, { state: false })).toEqual([2, 3]);
    expect(toggle([1, 2, 3], 1, { state: true })).toEqual([1, 2, 3]);
    expect(toggle([1, 2, 3], 3, { state: true })).toEqual([1, 2, 3]);
    expect(toggle([1, 2, 3], 4, { state: false })).toEqual([1, 2, 3]);
  });

  test('Контролируемое состояние и объекты с функцией isEqual', () => {
    type Data = { value: number };

    const isEqual = (a: Data, b: Data): boolean => a.value === b.value;
    const data = (value: number): Data => ({ value });

    expect(toggle([data(1), data(2), data(3)], data(4), { state: true, isEqual })).toEqual([data(1), data(2), data(3), data(4)]);
    expect(toggle([data(1), data(2), data(3)], data(1), { state: false, isEqual })).toEqual([data(2), data(3)]);
    expect(toggle([data(1), data(2), data(3)], data(1), { state: true, isEqual })).toEqual([data(1), data(2), data(3)]);
    expect(toggle([data(1), data(2), data(3)], data(3), { state: true, isEqual })).toEqual([data(1), data(2), data(3)]);
    expect(toggle([data(1), data(2), data(3)], data(4), { state: false, isEqual })).toEqual([data(1), data(2), data(3)]);
  });
});
