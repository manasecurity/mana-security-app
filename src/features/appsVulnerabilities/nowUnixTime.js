export default function nowUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}
