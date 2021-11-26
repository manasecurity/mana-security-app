import { STATE_STORAGE_STATUS_KEY } from '../../configs';
import { savePersistentState } from './persistHelpers';

export default async function statusWriteAsync(status) {
  savePersistentState(STATE_STORAGE_STATUS_KEY, status);
}
