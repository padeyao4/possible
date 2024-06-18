import {
  AccountControllerApi,
  Configuration,
  StorageControllerApi,
  type User,
  UserControllerApi
} from '@/openapi';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { useNotify } from './notity';
import { useProjectStore } from './project';

export const useAccount = defineStore(
  'account',
  () => {
    const online = ref(false);
    const enableSync = ref(false);
    const dataVersion = ref<number>(0);
    const token = ref<string>();
    const user = reactive<User>({});

    function updateUser(o: User) {
      Object.assign(user, o);
    }

    return {
      user,
      token,
      online,
      enableSync,
      dataVersion,
      updateUser
    };
  },
  {
    persist: true
  }
);
