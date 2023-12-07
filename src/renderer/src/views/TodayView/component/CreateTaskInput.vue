<script setup lang="ts">
import {ListAdd, Plus, Round} from "@icon-park/vue-next";
import {useStore} from "@renderer/store/project";
import {computed, ref, watch} from "vue";
import {Possible} from "@renderer/model";
import IProject = Possible.IProject;

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

const selectValue = ref<IProject | undefined>(store.list?.[0])

watch(store.list, () => {
  const id = selectValue.value?.id
  selectValue.value = store.projects.get(id as string)
  if (!selectValue.value?.id) {
    selectValue.value = store.projects?.[0]
  }
})

function handleClickAddon(project: IProject) {
  selectValue.value = project
}

const inputValue = ref('')

function handleSubmit() {
  console.log(inputValue.value, selectValue.value?.name)
  if (selectValue.value?.id) {
    const node = new Possible.Node(inputValue.value, selectValue.value.id)
    selectValue.value.data.nodes.push(node)
  } else {
    const projectId = store.createByName('默认')
    const node = new Possible.Node(inputValue.value, projectId)
    store.projects.get(projectId)!.data.nodes.push(node)
  }
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
        <div class="text">{{ selectValue?.name ?? '默认' }}</div>
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
