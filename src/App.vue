<script setup lang="ts">
import { emitter } from '@/utils';
import { useAccount } from '@/stores';
import { axiosConfig } from '@/core/config';
import LoginView from '@/views/LoginView.vue';
import { RouterView } from 'vue-router';
import { onBeforeUnmount } from 'vue';
import {
  useListenAppEvent,
  useListenBacklogEvent,
  useListenEdgeEvent,
  useListenNodeEvent,
  useListenNotifyEvent,
  useListenProjectEvent,
  useLoadApp
} from '@/service';

axiosConfig();

useListenNotifyEvent();
useListenAppEvent();
useListenNodeEvent();
useListenEdgeEvent();
useListenBacklogEvent();
useListenProjectEvent();

useLoadApp();

const account = useAccount();

onBeforeUnmount(() => {
  emitter.all.clear();
});
</script>

<template>
  <router-view v-if="account.isAuth" />
  <login-view v-else />
</template>
