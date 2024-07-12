import { emitter } from '@/utils';
import { useAccount, useCounter, useProjects } from '@/stores';

/*
export function useScheduler() {
  const scheduler = ref();

  scheduleMidnightTask(scheduler, () => {
    // todo
    // emitter.emit(BusEvents['project:daily:update']);
  });

  onMounted(() => {
    clearInterval(scheduler.value);
  });
}
*/

/*export function useUpdateDate() {
  const timer = useTimer();
  const interval = ref();

  interval.value = setInterval(() => {
    timer.update();
  }, 600_000);

  onBeforeUnmount(() => {
    clearInterval(interval.value);
  });
}*/
export function useListenNotifyEvent() {
  emitter.on('notify:error', (e) => {
    console.error(e.message);
  });
}

export function useListenNodeEvent() {
  emitter.on('node:update', (e) => {
    // TODO: update project
  });
}

export function useListenProjectEvent() {
  const projects = useProjects();
  emitter.on('project:update', (e) => {
    // TODO: update project
  });
  emitter.on('project:create', async (project) => {
    await projects.save();
  });
}

export function useListenEdgeEvent() {
  emitter.on('edge:update', (e) => {
    // TODO: update project
  });
}

export function useListenBacklogEvent() {
  emitter.on('backlog:update', (e) => {
    // TODO: update project
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
    await account.fetchUser();

    if (account.isRemote) {
      await projects.fetch();
    } else {
      await projects.load();
    }

    projects.dailyUpdate();
    counter.countTodos();
  });
}
