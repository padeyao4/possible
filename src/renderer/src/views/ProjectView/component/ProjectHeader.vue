<script setup lang="ts">
import {useProject} from "@renderer/util/project";
import {ref} from "vue";
import {More} from "@icon-park/vue-next";
import router from "@renderer/router";
import {useStore} from "@renderer/store/project";

const store = useStore()
const project = useProject()!

const inputShow = ref(false)

function submitInput() {
  project.name = project.name.trim() === '' ? 'untitled' : project.name.trim()
  inputShow.value = false
}

const dialogShow = ref(false)

const moreHover = ref(false)

</script>

<template>
  <div class="project-header">
    <div class="project-title">
      <input
        v-if="inputShow"
        :ref="(e)=>(e as HTMLElement)?.focus?.()"
        v-model="project.name"
        class="project-title-text"
        @blur="submitInput"
        @keydown.enter="submitInput"
      />
      <div v-else class="project-title-text" @click="inputShow=true">
        {{ project.name }}
      </div>
    </div>
    <div class="project-more">
      <el-dropdown class="operation-list" trigger="click">
        <div style="height: 40px;width: 40px;display: flex;justify-content: end;align-items: end">
          <div @mouseover="moreHover=true" @mouseleave="moreHover=false">
            <more v-if="moreHover" theme="outline" size="20" fill="#33333360" :strokeWidth="2"
                  style="display: flex;justify-content: center;align-items: center;"/>
            <more v-else theme="outline" size="20" fill="#333" :strokeWidth="2"
                  style="display: flex;justify-content: center;align-items: center;"/>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="dialogShow = true"
            >删除
            </el-dropdown-item>
            <el-dropdown-item @click="inputShow=true">重命名</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <Teleport to="body">
        <el-dialog v-model="dialogShow" title="警告" width="30%" align-center>
              <span
              >确定删除 <i style="font-size: large">{{ project.name ?? '' }} </i> 计划吗</span
              >
          <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="dialogShow = false">取消</el-button>
                  <el-button
                    @click="()=>{router.push({name: 'today'});store.projects.delete(project.id)}"
                  > 确定 </el-button>
                </span>
          </template>
        </el-dialog>
      </Teleport>
    </div>
  </div>

</template>

<style scoped>

.project-header {
  height: 100%;
  display: grid;
  padding: 0 24px;
  grid-template-columns: 1fr 150px;
  -webkit-app-region: drag;
}

.project-title {
  width: 100%;
  height: 100%;
}

.project-title-text {
  font-size: 20px;
  display: flex;
  outline: none;
  border: none;
  align-items: center;
  -webkit-app-region: no-drag;
  user-select: none;
  height: 100%;
  max-width: calc(var(--content-width) - 150px) !important;
  width: max-content;

  &:hover {
    cursor: text;
  }

  &:focus {
    border-radius: 4px;
    background: #b2b4b430;
  }
}

.operation-list {
  -webkit-app-region: no-drag;
}

.project-more {
  display: flex;
  justify-content: end;
  align-items: end;
}
</style>
