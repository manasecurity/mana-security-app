/**
 * Gets a CPE name for a given app object.
 *
 * @param {Dict} app an app object supported by Mana.
 * @returns string with a corresponding CPE-name.
 */
export default function getCPEName(app) {
  return `${app.cpe_part}:${app.cpe_vendor}:${app.cpe_product}`;
}
