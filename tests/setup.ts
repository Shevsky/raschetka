expect.extend({
  toBeNullish(received) {
    return {
      pass: received === null || received === undefined,
      expected: 'null | undefined',
      actual: received,
      message: () => 'expected null or undefined'
    };
  },
  toBeNormalized(received, expected) {
    const normalize = (s) => s.replaceAll('\xA0', ' ').replaceAll('‑', '-');

    const normalizedExpected = normalize(expected);
    const normalizedReceived = normalize(received);

    return {
      pass: normalizedReceived === normalizedExpected,
      expected: normalizedExpected,
      actual: normalizedReceived,
      message: () => `expected string to be equal (ignoring non-breaking spaces/hyphens)`
    };
  }
});
