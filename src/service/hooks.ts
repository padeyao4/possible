import { emitter, save } from '@/utils';
import { useProjects } from '@/stores';

/*export function useListenNotifyEvent() {
  emitter.on('notify:error', (e) => {
    console.error(e.message);
  });
}

export function useListenNodeEvent() {
  emitter.on('node:update', async () => {
    await debounceSaveAll();
  });
  emitter.on('node:create', async () => {
    await debounceSaveAll();
  });
  emitter.on('node:delete', async () => {
    await debounceSaveAll();
  });
}

export function useListenProjectEvent() {
  emitter.on('project:update', async (e) => {
    await debounceSaveAll();
  });
  emitter.on('project:create', async (project) => {
    await debounceSaveAll();
  });
  emitter.on('project:delete', async (project) => {
    await debounceSaveAll();
  });
}

export function useListenEdgeEvent() {
  emitter.on('edge:update', async (e) => {
    await debounceSaveAll();
  });
  emitter.on('edge:create', async (e) => {
    await debounceSaveAll();
  });
  emitter.on('edge:delete', async (e) => {
    await debounceSaveAll();
  });
}

export function useListenBacklogEvent() {
  emitter.on('backlog:update', async (e) => {
    await debounceSaveAll();
  });
  emitter.on('backlog:create', async (e) => {
    await debounceSaveAll();
  });
  emitter.on('backlog:delete', async (e) => {
    await debounceSaveAll();
  });
}*/

export function useListenElectronEvent() {
  const projects = useProjects();

  window.ipcRenderer.on('electron:exit', async () => {
    await save();
    window.ipcRenderer.send('electron:exit');
  });

  window.ipcRenderer.on('electron:close', async () => {
    await save();
  });

  window.ipcRenderer.on('electron:schedule', async () => {
    projects.dailyUpdate();
  });
}

/*export async function initApp() {
  useListenNotifyEvent();
  useListenNodeEvent();
  useListenProjectEvent();
  useListenEdgeEvent();
  useListenBacklogEvent();
  useListenElectronEvent();
  await load();
  const projects = useProjects();
  projects.dailyUpdate();
}*/

/**
 * 初始化事件监听
 */
export async function initEventListen() {
  emitter.on('*', async () => {
    await save();
  });
  emitter.on('notify:error', (e) => {
    console.error(e.message);
  });
  useListenElectronEvent();
}