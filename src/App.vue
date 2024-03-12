<script setup lang="ts">
import router from '@/router'
import { useStore } from '@/stores/store'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { projects } = useStore()

onMounted(() => {
  router.push('/today')
})

</script>

<template>
  <main>
    <aside>
      <header>
        <div @click="router.push('/')">one day</div>
        <div @click="router.push('/completed')">completed project</div>
      </header>
      <hr />
      <div v-for="project in projects" @click="router.push(`/project/${project.id}`)">{{ project.name }}
      </div>
    </aside>
    <section>
      <router-view :key="route.fullPath"></router-view>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
}

aside {
  width: 240px;
  height: 100vh;
  border: solid 1px;
}

section {
  width: calc(100% - 240px);
  height: 100vh;
  background: antiquewhite;
}
</style>