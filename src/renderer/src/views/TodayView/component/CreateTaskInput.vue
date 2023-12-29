<script setup lang="ts">
import {ListAdd, Plus, Round} from "@icon-park/vue-next";
import {useStore} from "@renderer/store/project";
import {computed, ref, watch, watchEffect} from "vue";
import {PNode, PProject} from "@renderer/model";

const store = useStore()

const addonVisible = ref(false)

function changeAddonVisible() {
  addonVisible.value = false
}

watch(addonVisible, () => {
  if (addonVisible.value) {
    document.addEventListener('click', changeAddonVisible)
  } else {
    document.removeEventListener('click', changeAddonVisible)
  }
})

const listItemHeight = 30;

const project = ref<PProject>()

watchEffect(() => {
  if (!project.value || !store.projects.has(project.value.id)) {
    project.value = store.list?.[0]
  }
})

function handleClickAddon(p: PProject) {
  project.value = p
}

const inputValue = ref('')

function handleSubmit() {
  const node = new PNode()
  node.name = inputValue.value
  if (node.name.trim() === '') {
    node.name = '未命名'
  }

  if (!project.value) {
    project.value = new PProject()
    project.value.name = '默认'
    store.projects.set(project.value.id, project.value)
  }

  node.projectId = project.value.id
  node.dn = store.dn - project.value.origin
  project.value.nodes.set(node.id, node)

  store.update()
  inputValue.value = ''
}

const offsetHeight = computed(() => {
  return store.projects.size * listItemHeight
})

</script>

<template>
  <div class="create-task-input">
    <div class="footer-input">
      <div class="addon" @click.stop="addonVisible=!addonVisible">
        <div class="list" v-show="addonVisible"
             :style="{'top':`calc(${offsetHeight}px * -1 - 4px)`,'height':`${offsetHeight}px`}">
          <div v-for="item in store.list" :style="{'height':listItemHeight}" class="item"
               @click="()=>{handleClickAddon(item as any)}">{{ item.name }}
          </div>
        </div>
        <list-add theme="outline" size="24" fill="#333" :strokeWidth="2" class="icon"/>
        <div class="text">{{ project?.name ?? '默认' }}</div>
      </div>
      <input class="input" v-model="inputValue" placeholder="添加任务" @keydown.enter="handleSubmit"/>
      <plus theme="outline" size="24" fill="#333" :strokeWidth="2" class="icon plus"/>
      <Round theme="outline" size="24" fill="#333" :strokeWidth="2" strokeLinecap="butt" class="icon round"/>
    </div>
  </div>
</template>

<style scoped>
.create-task-input {
  height: 100%;
  padding: 8px 24px 16px 24px;

  .footer-input {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    height: 100%;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.7);

    .addon {
      position: relative;
      display: flex;
      user-select: none;
      max-width: 160px !important;

      .text {
        font-weight: 1;
        font-size: 14px;
        display: flex;
        justify-content: start;
        align-items: center;
        margin: 0 8px 0 0;
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
        word-break: break-all;
        white-space: nowrap;
      }

      .list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100px;
        left: calc(100% - 100px);
        background: var(--color-background);
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;

        .item {
          display: flex;
          justify-content: start;
          align-items: center;
          padding: 4px;
          width: 100%;
          font-size: 14px;
          font-weight: 1;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
          word-break: break-all;
          white-space: nowrap;

          &:hover {
            background: #82bbb550;
          }
        }
      }

      &:hover {
        background: #82bbb550;
      }
    }

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px;
    }

    .plus {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px;
    }

    .round {
      display: none;
      justify-content: center;
      align-items: center;
      margin: 8px;
    }

    .input {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      border: 0;
      outline-style: none;
      padding: 0 8px;
      background: rgba(255, 255, 255, 0.7);
    }

    .input:focus ~ .plus {
      display: none;
    }

    .input:focus ~ .round {
      display: flex;
    }
  }
}
</style>
