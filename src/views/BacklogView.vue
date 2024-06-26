<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import ECounterButton from '@/components/common/ECounterButton.vue';
import EDraggable from '@/components/common/EDraggable.vue';
import BacklogItem from '@/components/backlog/BacklogItem.vue';

type TodoItem = {
  id: number;
  title: string;
  done: boolean;
};

const list = reactive<TodoItem[]>([
  {
    id: 1,
    title: '吃饭',
    done: false
  },
  {
    id: 2,
    title: '吃饭1',
    done: false
  },
  {
    id: 3,
    title: '吃饭2',
    done: true
  },
  {
    id: 4,
    title: '吃饭3',
    done: false
  }
]);

const todos = computed(() => {
  return list.filter((todo) => !todo.done);
});

const completed = computed(() => {
  return list.filter((todo) => todo.done);
});

const visible = ref(false);
</script>

<template>
  <div class="backlog">
    <div class="title">备忘录</div>
    <div class="todos">
      <e-draggable v-model="todos" class="wrapper">
        <template #default="{ item }">
          <backlog-item :item="item" />
        </template>
      </e-draggable>
    </div>
    <e-counter-button :count="completed.length" v-model="visible" class="count-class" />
    <div class="completed" v-show="visible">
      <backlog-item v-for="item in completed" :item="item" />
    </div>
  </div>
</template>

<style scoped>
.backlog {
  background-color: #5c83ab90 !important;
}
.title {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 12px 24px;
  font-size: 18px;
}
.todos {
  margin: 0 24px;
}
.completed {
  margin: 0 24px;
  & > * {
    margin: 4px 0;
  }
}
.count-class {
  margin: 0 24px;
}
.wrapper {
  & > * {
    margin: 4px 0;
  }
}
</style>
