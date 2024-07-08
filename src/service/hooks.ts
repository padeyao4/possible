import { onBeforeUnmount, onMounted, ref } from 'vue';
import { scheduleMidnightTask, useTimer } from '@/stores/timer';
import { emitter } from '@/utils';

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

export function useUpdateDate() {
  const timer = useTimer();
  const interval = ref();

  interval.value = setInterval(() => {
    timer.update();
  }, 600_000);

  onBeforeUnmount(() => {
    clearInterval(interval.value);
  });
}

export function useListenNodeEvent() {
  emitter.on('node:update', (e) => {
    // TODO: update project
  });
}
export function useListenProjectEvent() {
  emitter.on('project:update', (e) => {
    // TODO: update project
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
