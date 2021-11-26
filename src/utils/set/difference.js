export default function difference(setA, setB) {
  // const setDifference = new Set(setA);
  // setB.keys().reduce((set, x) => set.delete(x), setDifference);
  // return setDifference;
  return new Set([...setA].filter((x) => !setB.has(x)));
}
