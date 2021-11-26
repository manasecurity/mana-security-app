import filterRelevantCVENames from './filterRelevantCVENames'


test('single FF vuln\'s CVE appears in results', () => {
  const ffSingleVulnList = [{
    cve: "CVE-2042-0001",
    versions: [{
      cpe: "a:mozilla:firefox"
    }]
  }]

  expect(filterRelevantCVENames("a:mozilla:firefox", ffSingleVulnList)).toEqual(["CVE-2042-0001"])
})


test('two FF vulns\' CVE appears in results', () => {
  const ffSingleVulnList = [
    {
      cve: "CVE-2042-0001",
      versions: [{
        cpe: "a:mozilla:firefox"
      }]
    },
    {
      cve: "CVE-2042-0002",
      versions: [{
        cpe: "a:mozilla:firefox"
      }]
    },
  ]

  expect(filterRelevantCVENames("a:mozilla:firefox", ffSingleVulnList)).toEqual([
    "CVE-2042-0001",
    "CVE-2042-0002"
  ])
})


test('chrome\'s vuln CVE id does not appears in results for FF', () => {
  const ffSingleVulnList = [{
    cve: "CVE-2042-0001",
    versions: [{
      cpe: "a:google:chrome"
    }]
  }]

  expect(filterRelevantCVENames("a:mozilla:firefox", ffSingleVulnList)).toEqual([])
})
