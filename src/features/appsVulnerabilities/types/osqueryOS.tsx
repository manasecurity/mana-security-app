import OsqueryProduct from './osqueryProduct';

export class OsqueryOS extends OsqueryProduct {
  constructor(
    major: string,
    minor: string,
    patch: string,
    vulns = {},
    productName = 'macos'
  ) {
    const version = `${major}.${minor}.${patch}`;
    super(version, [productName], '/', vulns);
  }
}

export function toOsqueryOS(raw_record: Record<string, string>): OsqueryOS {
  const osqOS = new OsqueryOS(
    raw_record.major,
    raw_record.minor,
    raw_record.patch
  );

  return osqOS;
}
