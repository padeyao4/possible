import { emitter } from '@/utils';
import { useAccount, useCounter, useProjects } from '@/stores';

export function useListenNotifyEvent() {
  emitter.on('notify:error', (e) => {
    console.error(e.message);
  });
}

export function useListenNodeEvent() {
  emitter.on('node:update', (e) => {
    // TODO: update project
    console.log('update node', e);
  });
  emitter.on('node:create', (e) => {
    // TODO: update project
    console.log('create node', e);
  });
  emitter.on('node:delete', (e) => {
    // TODO: update project
    console.log('delete node', e);
  });
}

export function useListenProjectEvent() {
  const projects = useProjects();
  emitter.on('project:update', (e) => {
    // TODO: update project
    console.log('project update', e);
  });
  emitter.on('project:create', async (project) => {
    await projects.save();
  });
  emitter.on('project:delete', async (project) => {
    await projects.save();
  });
}

export function useListenEdgeEvent() {
  emitter.on('edge:update', (e) => {
    // TODO: update project
    console.log('edge update', e);
  });
  emitter.on('edge:create', (e) => {
    // TODO: update project
    console.log('edge create', e);
  });
  emitter.on('edge:delete', (e) => {
    // TODO: update project
    console.log('edge delete', e);
  });
}

export function useListenBacklogEvent() {
  emitter.on('backlog:update', (e) => {
    // TODO: update project
    console.log('update backlog', e);
  });
  emitter.on('backlog:create', (e) => {
    console.log('create backlog', e);
  });
  emitter.on('backlog:delete', (e) => {
    console.log('delete backlog', e);
  });
}

export async function useLoadApp() {
  const account = useAccount();
  const response = await window.ipcRenderer.invoke('get', { key: 'account' });
  account.isAuth = response?.isAuth ?? false;
  account.isLocal = response?.isLocal ?? false;
  account.token = response?.token ?? '';
  if (!account.isAuth) return;
  emitter.emit('login:success');
}

export function useListenAppEvent() {
  const account = useAccount();
  const projects = useProjects();
  const counter = useCounter();
  emitter.on('login:success', async () => {
    console.log('login:success');
    if (account.isRemote) {
      await account.fetchUser();
      await projects.fetch();
    } else {
      await projects.load();
    }

    projects.dailyUpdate();
    counter.countTodos();
  });
}
