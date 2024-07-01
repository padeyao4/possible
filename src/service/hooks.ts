import { onBeforeUnmount, onMounted, ref } from 'vue';
import { scheduleMidnightTask, useTimer } from '@/stores/timer';
import emitter, { BusEvents } from '@/utils/emitter';

export function useScheduler() {
  const scheduler = ref();

  scheduleMidnightTask(scheduler, () => {
    emitter.emit(BusEvents['project:daily:update']);
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
