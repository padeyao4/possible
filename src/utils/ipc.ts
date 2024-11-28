import { useAccount, useBacklogs, useGraph } from '@/stores';
import { type ArgumentsType, type Promisify, useDebounceFn } from '@vueuse/core';

/**
 * Save data to ipc
 */
export async function save() {
  const projects = useGraph();
  const account = useAccount();
  const backlogs = useBacklogs();

  const data = {
    account: account.toPlainObject(),
    backlogs: backlogs.toPlainObject()
  };

  window.ipcRenderer.send('set', { key: 'data', value: data });
}

/**
 * Load data from ipc
 */
export async function load() {
  const projects = useGraph();
  const account = useAccount();
  const backlogs = useBacklogs();
  const data = await window.ipcRenderer.invoke('get', { key: 'data' });
  backlogs.fromPlainObject(data?.backlogs ?? []);
  account.fromPlainObject(data?.account);
}

export const debounceSaveAll: (
  ...args: ArgumentsType<() => void>
) => Promisify<ReturnType<() => void>> = useDebounceFn(save, 60_000);
