import intersection from './intersection';

test('given sets [a, b] and [b, c] fn results are [b]', () => {
  const anIntersect = intersection(new Set(['a', 'b']), new Set(['b', 'c']));
  expect(anIntersect).toEqual(new Set(['b']));
});

test('given sets [a, b] and [c, d] fn results are []', () => {
  const anIntersect = intersection(new Set(['a', 'b']), new Set(['c', 'd']));
  expect(anIntersect).toEqual(new Set([]));
});
