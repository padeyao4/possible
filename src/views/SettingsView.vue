<script setup lang="ts">
import { invoke } from '@tauri-apps/api';
import { Store } from 'tauri-plugin-store-api';
import { onBeforeUnmount } from 'vue';

const db = new Store('d:/settings.dat')

function testStore() {
  db.get('test').then(console.log)
}

function testTauri() {
  invoke('greet', { name: 'world' })
    .then((res) => console.log(res))
}

function testSetStore() {
  db.set('test', 'hello world')
}

function saveStore(){
  db.save()
}

onBeforeUnmount(() => {
  db.save()
})

</script>

<template>
  <div>
    <main>
      <div class="content">
        <header>
          <div id="main-title">配置</div>
        </header>
        <section>
          <div>
            <el-button @click="testTauri">test tauri</el-button>
            <el-button @click="testStore">test kv store</el-button>
            <el-button @click="testSetStore">test set kv store</el-button>
            <el-button @click="saveStore">save kv store</el-button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #8cb6c5;
}

.content {
  flex-grow: 1;
  padding: 24px 24px 0 24px;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
    rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}


header {
  height: 32px;
}

section {
  height: calc(100vh - 64px - 48px);
  width: calc(100vw - 240px - 24px * 2);
  overflow-y: auto;
  margin: 24px 0;
}


#main-title {
  display: flex;
  align-items: center;
  font-size: 20px;
}
</style>
