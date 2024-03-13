<script setup lang="ts">
import router from '@/router'
import { useStore } from '@/stores/store'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { VueDraggable } from 'vue-draggable-plus'

const route = useRoute()
const store = useStore()
const { isActive, setSelected } = store

const projects = computed({
  get: () => {
    return store.sortedProjects
  },
  set: () => {}
})

function onUpdate() {
  (store.sortedProjects as any[]).forEach((value, index) => {
    value.sortIndex = index
  })
}

onMounted(() => {
  setSelected('today')
  router.push('/today')
})

</script>

<template>
  <div>
    <main>
      <aside>
        <header>
          <ul>
            <li class="selected-item" :class="{selected: isActive('today')}"
                @click="setSelected('today');router.push('/')">today
            </li>
            <li class="selected-item" :class="{selected: isActive('completed')}"
                @click="setSelected('completed');router.push('/completed')">
              completed project
            </li>
          </ul>
        </header>
        <div id="body" @pointercancel.prevent>
          <vue-draggable v-model="projects"
                         chosenClass="chosen-class"
                         dragClass="drag-class"
                         ghostClass="ghost-class"
                         @update="onUpdate"
                         @pointercancel.prevent>
            <div v-for="project in projects"
                 @pointercancel.prevent
                 class="selected-item"
                 @click="setSelected(project.id);router.push(`/project/${project.id}`)"
                 :class="{selected: isActive(project.id)}"
                 :key="project.id">
              {{ project.name }}
            </div>
          </vue-draggable>
        </div>
        <footer class="selected-item">
          create project
        </footer>
      </aside>
      <section>
        <router-view :key="route.fullPath" id="content" />
      </section>
    </main>
  </div>
</template>

<style scoped>
main {
  display: flex;
  background: var(--background);
}

aside {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 240px;
  height: 100vh;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

header {
  flex-shrink: 0;
  padding: 2px 0;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

#body {
  flex-grow: 1;
  padding: 2px 0;
  overflow-y: auto;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

footer {
  flex-shrink: 0;
}

.selected-item {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 4px 8px;
  padding: 0 4px;
  user-select: none;

  &:hover {
    border-radius: 4px;
    background: var(--active);
  }
}

.selected {
  border-radius: 4px;
  background: var(--active);
}

section {
  display: flex;
  flex-grow: 1;
  background: #fdfdfd;
  box-shadow: rgba(0, 0, 0, 0.09) 0 0 4px;
  border-radius: 8px 0 0 0;
}

#content {
  flex-grow: 1;
}

ul {
  list-style-type: none;
}


</style>