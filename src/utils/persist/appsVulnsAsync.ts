import { STATE_STORAGE_APPSVULNS_KEY } from '../../configs';
import { savePersistentState } from './persistHelpers';

export default async function appsVulnsWriteAsync(appsVulns) {
  console.log('persisting apps vulns...');
  savePersistentState(STATE_STORAGE_APPSVULNS_KEY, appsVulns);
}
