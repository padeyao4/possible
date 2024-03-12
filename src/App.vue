<script setup lang="ts">
import router from '@/router'

function handleLink() {
  router.push('/project')
}

</script>

<template>
  <main>
    <aside>
      <header>
        <router-link to="/">one day</router-link>
      </header>
      <hr />
      <div @click="handleLink">hello-world</div>
    </aside>
    <section>
      <router-view></router-view>
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