export default function cutAppExtension(appName) {
  return appName && appName.length && appName.endsWith('.app')
    ? appName.slice(0, -4)
    : appName;
}
