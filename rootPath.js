export default function rootPath() {
  let path = __dirname;
  if (path.endsWith('app.asar')) {
    path = path.slice(0, -9);
  }
  return path;
}
