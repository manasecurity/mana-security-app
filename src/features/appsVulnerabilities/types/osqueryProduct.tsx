/* eslint-disable class-methods-use-this */
export default class OsqueryProduct {
  currentVersion: string;

  aliases: Array<string>;

  path: string;

  vulns;

  constructor(
    currentVersion: string,
    aliases: Array<string>,
    path: string,
    vulns
  ) {
    this.currentVersion = currentVersion;
    this.aliases = aliases;
    this.path = path;
    this.vulns = vulns;
  }
}
