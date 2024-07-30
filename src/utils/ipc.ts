import { useAccount, useBacklogs, useProjects, useSide } from '@/stores';
import { type ArgumentsType, type Promisify, useDebounceFn } from '@vueuse/core';

export async function saveAll() {
  const projects = useProjects();
  const account = useAccount();
  const backlogs = useBacklogs();
  const side = useSide();

  const data = {
    account: account.toPlainObject(),
    projects: projects.toPlainObject(),
    backlogs: backlogs.toPlainObject(),
    side: side.toPlainObject()
  };

  console.log('save data', data);

  window.ipcRenderer.send('set', { key: 'current', value: account.toPlainObject() });
  window.ipcRenderer.send('set', { key: `${account.userName}`, value: data });
}

export async function loadAll() {
  const projects = useProjects();
  const account = useAccount();
  const backlogs = useBacklogs();
  const side = useSide();
  const current = await window.ipcRenderer.invoke('get', { key: 'current' });
  account.fromPlainObject(current);
  const data = await window.ipcRenderer.invoke('get', { key: `${account.userName}` });
  backlogs.fromPlainObject(data?.backlogs ?? []);
  projects.fromPlainObject(data?.projects ?? []);
  side.fromPlainObject(data?.side);
}

export const debounceSaveAll: (
  ...args: ArgumentsType<() => void>
) => Promisify<ReturnType<() => void>> = useDebounceFn(saveAll, 60_000);
