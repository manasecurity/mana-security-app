import cutAppExtension from '../cutAppExtension';
import OsqueryProduct from './osqueryProduct';

export class OsqueryApp extends OsqueryProduct {
  constructor({
    bundle_name = '',
    bundle_short_version = '',
    name = '',
    path = '',
    vulns = {},
  } = {}) {
    const appName = cutAppExtension(name);
    const nameFields = [bundle_name.toLowerCase(), appName.toLowerCase()];
    const aliases = nameFields.filter(
      (elem, index, self) => index === self.indexOf(elem)
    );

    super(bundle_short_version, aliases, path, vulns);
  }
}

export function toOsqueryApp(raw_record: Record<string, string>): OsqueryApp {
  const osqApp = new OsqueryApp({
    bundle_name: raw_record.bundle_name,
    bundle_short_version: raw_record.bundle_short_version,
    name: raw_record.name,
    path: raw_record.path,
    vulns: {},
  });

  return osqApp;
}
