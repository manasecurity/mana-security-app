import { STATE_STORAGE_ANALYTICS_KEY } from '../../configs';
import { savePersistentState } from './persistHelpers';

export default async function analyticsWriteAsync(analytics) {
  console.log('persisting analytics...');
  savePersistentState(STATE_STORAGE_ANALYTICS_KEY, analytics);
}
