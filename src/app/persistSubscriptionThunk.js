import { ipcRenderer } from 'electron';

export default function persistSubscriptionThunk() {
  return (dispatch, getState) => {
    const { subscription, appsVulns } = getState();
    ipcRenderer.send('persist:update-subscription', subscription);
    ipcRenderer.send('persist:update-apps-vulns', appsVulns);
  };
}
