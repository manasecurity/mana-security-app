import difference from './difference';

test('common item is not present in difference', () => {
  const aMinusB = difference(new Set(['a', 'b']), new Set(['b', 'c']));
  expect(aMinusB).toEqual(new Set(['a']));
});

test('a set with no common items should remain the same', () => {
  const aMinusB = difference(new Set(['a', 'b']), new Set(['c']));
  expect(aMinusB).toEqual(new Set(['a', 'b']));
});
