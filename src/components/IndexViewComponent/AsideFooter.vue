<script setup lang="ts">
import { handleNewProject } from '@/service/project.service';
import { useNotify } from '@/stores/notity';
import { useRoute } from '@/stores/route';
import { Icon } from '@iconify/vue/dist/iconify.js';

const { linkTo } = useRoute();
const notify = useNotify();
</script>

<template>
  <div id="aside-footer">
    <div class="side-list-item add" data-hover @click="handleNewProject">
      <Icon icon="solar:add-square-broken" class="side-icon" />
      <div class="side-item-text">创建项目</div>
    </div>
    <div class="icon-button">
      <div class="side-list-item icon-warp" @click="linkTo('settings')">
        <Icon icon="solar:settings-broken" class="settings-icon" />
        <div class="notify" v-show="notify.hasNotify"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#aside-footer {
  display: flex;
  flex-direction: row;
  height: 48px;
  border-top: #00000010 1px solid;

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-left: 1px solid #00000010;
  }

  .add {
    display: flex;
    flex-grow: 1;
    align-items: center;
    height: 40px;
    margin: 4px;
    padding: 4px;
  }

  .icon-warp {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    &:hover {
      background-color: burlywood;
    }
  }
}

.settings-icon {
  width: 24px;
  height: 24px;
  border-radius: 8px;
}

.notify {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 8px;
  height: 8px;
  background-color: #ff000090;
  border-radius: 50%;
}
</style>
