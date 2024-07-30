import { debounceSaveAll, emitter, saveAll } from '@/utils';
import { useCounter, useProjects } from '@/stores';

export function useListenNotifyEvent() {
  emitter.on('notify:error', (e) => {
    console.error(e.message);
  });
}

export function useListenNodeEvent() {
  const counter = useCounter();
  emitter.on('node:update', async () => {
    await debounceSaveAll();
    counter.countTodos();
  });
  emitter.on('node:create', async () => {
    await debounceSaveAll();
    counter.countTodos();
  });
  emitter.on('node:delete', async () => {
    await debounceSaveAll();
    counter.countTodos();
  });
}

export function useListenProjectEvent() {
  const counter = useCounter();
  emitter.on('project:update', async (e) => {
    await debounceSaveAll();
  });
  emitter.on('project:create', async (project) => {
    await debounceSaveAll();
  });
  emitter.on('project:delete', async (project) => {
    counter.countTodos();
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
}

export function useListenAppEvent() {
  const projects = useProjects();
  const counter = useCounter();
  emitter.on('login:success', async () => {
    console.log('login:success');
    projects.dailyUpdate();
    counter.countTodos();
  });
}

export function useListenElectronEvent() {
  window.ipcRenderer.on('electron:exit', async () => {
    await saveAll();
    window.ipcRenderer.send('electron:exit');
  });

  window.ipcRenderer.on('electron:close', async () => {
    await saveAll();
  });
}
