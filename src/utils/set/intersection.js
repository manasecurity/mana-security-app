export default function intersection(setA, setB) {
  return new Set([...setA].filter((x) => setB.has(x)));
}
