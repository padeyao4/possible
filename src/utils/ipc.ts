import { useAccount, useBacklogs, useProjects, useLayout } from '@/stores';
import { type ArgumentsType, type Promisify, useDebounceFn } from '@vueuse/core';

/**
 * Save data to ipc
 */
export async function save() {
  const projects = useProjects();
  const account = useAccount();
  const backlogs = useBacklogs();
  const side = useLayout();

  const data = {
    account: account.toPlainObject(),
    projects: projects.toPlainObject(),
    backlogs: backlogs.toPlainObject(),
    layout: side.toPlainObject()
  };

  window.ipcRenderer.send('set', { key: 'data', value: data });
}

/**
 * Load data from ipc
 */
export async function load() {
  const projects = useProjects();
  const account = useAccount();
  const backlogs = useBacklogs();
  const layout = useLayout();
  const data = await window.ipcRenderer.invoke('get', { key: 'data' });
  backlogs.fromPlainObject(data?.backlogs ?? []);
  projects.fromPlainObject(data?.projects ?? []);
  layout.fromPlainObject(data?.layout);
  account.fromPlainObject(data?.account);
  projects.dailyUpdate()
}

export const debounceSaveAll: (
  ...args: ArgumentsType<() => void>
) => Promisify<ReturnType<() => void>> = useDebounceFn(save, 60_000);
