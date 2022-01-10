const dumbVulnsRepo = {
  'CVE-2021-0001': {
    cve: 'CVE-2021-0001',
    description:
      'Mozilla developers and community members reported memory safety bugs present in Firefox 90. Some of these bugs showed evidence of memory corruption and we presume that with enough effort some of these could have been exploited to run arbitrary code. This vulnerability affects Firefox < 91.',
    references: ['https://www.mozilla.org/security/advisories/mfsa2021-33/'],
    solution: 'Update to Mozilla version 91 or later',
    pub_date: '08/17/2021',
    cvss3_value: 0,
    versions: [
      {
        cpe: 'a:mozilla:firefox',
        vulnerable: true,
        last_version: '142.0.3',
        operator: '<',
      },
    ],
  },
};

const dumbAppsRepo = {
  'a:mozilla:firefox': {
    // "id": "abcdef123",
    app_name: 'Firefox',
    cpe_part: 'a',
    cpe_vendor: 'mozilla',
    cpe_product: 'firefox',
    aliases: ['firefox', 'firefox hd'],
    // "homepage": "https://firefox.com/",
    description: 'Top web browser',
    vulns: ['CVE-2021-0001'],
  }
};

export { dumbVulnsRepo, dumbAppsRepo };
