<script setup lang="ts">
import { useStore } from '@/stores/store';


const store = useStore()

function onSave() {
  store.$hydrate()
}

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
            <el-button @click="onSave">save</el-button>
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
