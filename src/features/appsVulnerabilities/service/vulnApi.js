import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import filterRelevantCVENames from '../../../utils/nvd/filterRelevantCVENames';
import getCPEName from '../../../utils/nvd/getCPEName';

export const API_POLLING_INTERVAL = 5 * 60 * 1000; // Every 5 minutes we call API endpoints.
export const QUERY_OPTIONS = { pollingInterval: API_POLLING_INTERVAL };

const manaHostName = 'https://slack.manasecurity.com';

const getUserToken = () => {
  return '';
};

const transformRepository = (response) => {
  // Transform apps into a dict by CPE name.
  const appsById = response.apps.reduce((buff, app) => {
    // Detect a CPE name.
    const cpeName = getCPEName(app);

    // Initial apps' dict does not contain a mapping to vulns. To improve the performance
    // of vulnerability lookup, we have to add all relevant CVE ids into the app.
    const vulns = filterRelevantCVENames(cpeName, response.vulns);

    // Now everything is ready, so we transform initial app object into a map: <CPE>:<App>.
    buff[cpeName] = {
      ...app,
      vulns,
    };
    return buff;
  }, {});

  // Transform vulns into a dict by CVE id.
  console.info(`Received ${response.vulns.length} vulns`);
  const vulnsById = response.vulns.reduce((buff, vuln) => {
    buff[vuln.cve] = vuln;
    return buff;
  }, {});

  return {
    apps: appsById,
    vulns: vulnsById,
  };
};

export const vulnApi = createApi({
  reducerPath: 'vulnApi',
  baseQuery: fetchBaseQuery({
    // fetch is not defined in test environment (SSR), so we should make a dumb mock. Works until
    // actual tests will execute this method. If this's the case, mock the fetch function.
    fetchFn: typeof fetch === 'function' ? fetch : () => '',
    // TODO: IMPORTANT This endpoint leaks information.
    baseUrl: `${manaHostName}/api/v1.0/`,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Token ${getUserToken()}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    /**
     * DEPRECATED
     *
     * Download a full vulns repository from our backend.
     *
     * @param {dict} response a dict of supported apps and vulns from the Mana backend. Each root
     * level field is a list with app's or vuln's object.
     * @returns {dict} an initial dictionary with transformed apps' and vulns' lists into a dict.
     * The dicts contain id and initial object value: <CPE>:<App> for an app object, <CVE>:<Vuln>
     * for a vuln object. Also, the result <App> object contains a list with relevant CVE ids.
     */
    getFullVulns: builder.query({
      query: () => `assets/vuln_bckps/all_vulns/`,
      transformResponse: (response) => transformRepository(response),
    }),

    /**
     * DEPRECATED
     *
     * Same as getFullVulns, but downloads a repository with recent changes.
     */
    getRecentVulns: builder.query({
      query: () => `assets/vuln_bckps/new_vulns/`,
      transformResponse: (response) => transformRepository(response),
    }),

    /**
     * DEPRECATED
     *
     * Fetches hashes of Mana datasets.
     */
    getMetas: builder.query({
      query: () => `assets/vuln_bckps/`,
      transformResponse: (response) => {
        const metasByName = response.results.reduce((buff, repoMeta) => {
          buff[repoMeta.name] = repoMeta;
          return buff;
        }, {});

        return metasByName;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
// eslint-disable-next-line prettier/prettier
export const { useGetFullVulnsQuery, useGetMetasQuery, useGetRecentVulnsQuery } = vulnApi;
