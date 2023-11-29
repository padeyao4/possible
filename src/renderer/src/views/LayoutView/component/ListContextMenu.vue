<script setup lang="ts">

import {watch} from "vue";
import {useProjectStore} from "@renderer/store/project";

const props = defineProps<{
  x: number,
  y: number,
  visible: boolean,
  projectId: string
}>()

const emit = defineEmits(['update:visible'])

const projectStore = useProjectStore()

function closeContext() {
  emit('update:visible', false)
}

watch(() => props.visible, () => {
  if (props.visible) {
    document.body.addEventListener('click', closeContext)
  } else {
    document.body.removeEventListener('click', closeContext)
  }
})

function handleList(e: any) {
  const opt = (e.target?.id ?? 'default') as string
  switch (opt) {
    case 'delete':
      console.log(props.projectId);
      projectStore.delete(props.projectId)
      break;
    default:
      console.warn('do nothing')
  }
}


</script>

<template>
  <div class="list-context-menu"
       :style="{'display': visible?'flex':'none','left': x+'px','top': y+'px'}"
  >
    <div class="content">
      <ul @click="(e)=>handleList(e)">
        <li id="delete">删除</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.list-context-menu {
  position: absolute;
  z-index: 99;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  background: #fff;

  .content {
    & ul, & ul li {
      list-style: none none;
      margin: 0;
      padding: 0;
      user-select: none;
    }

    & ul {
      padding: 4px;
    }

    & li {
      &:hover {
        background: var(--color-side-active);
      }
    }
  }
}
</style>
