import { STATE_STORAGE_SUBSCRIPTION_KEY } from '../../configs';
import { savePersistentState } from './persistHelpers';

export default async function subscriptionWriteAsync(subscription) {
  savePersistentState(STATE_STORAGE_SUBSCRIPTION_KEY, subscription);
}
