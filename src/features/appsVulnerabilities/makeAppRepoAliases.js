import cutAppExtension from "./cutAppExtension";

/**
 * Generates all possible names for a given Mana app. Mana app contains name variant in several
 * fields: "app_name" and "aliases". Both fields first lowercased and then returned as a list.
 *
 * Sidenote: "aliases" field contains a string with all known name variants. Each variant is
 * separated with a comma.
 *
 * @param {Dict<string, string>} repoApp supported Mana app.
 * @returns list with Mana app name's aliases.
 */
export default function makeAppRepoAliases(repoApp) {
  // Mana analysts put app name into "osquery_appname" field.
  const osqAppName = repoApp.os_query_app_name
    ? cutAppExtension(repoApp.os_query_app_name)
    : '';

  // App name alternatives are stored in 'aliases' field.
  const aliases = repoApp.aliases.concat([osqAppName]);

  // App aliases should be lowercased and without empty/null elements.
  const aliasesWithoutEmptyStrings = aliases.filter((x) => x.length > 0);
  const lowercaseAliases = aliasesWithoutEmptyStrings.map((x) =>
    x.toLowerCase()
  );

  // Remove duplicates
  const uniqueAliases = lowercaseAliases.filter(
    (elem, index, self) => index === self.indexOf(elem)
  );

  return uniqueAliases;
}
