import { useAccount } from '@/stores/account';
import { onMounted, watch } from 'vue';
import { Configuration, StorageControllerApi, UserControllerApi } from '@/openapi';
import { useProjectStore } from '@/stores/project';
import { useDebounceFn } from '@vueuse/core';
import { useNotify, KEYS } from '@/stores/notity';

let dataLoading = false;

export const config = () => {
  return new Configuration({
    baseOptions: {
      headers: {
        Token: useAccount().token
      }
    }
  });
};

/**
 * 用户登录后同步流程
 */
export function useListenLogin() {
  const account = useAccount();
  const notify = useNotify();
  const projectStore = useProjectStore();
  watch(
    () => account.online,
    (newValue) => {
      if (newValue) {
        // 获取用户信息
        new UserControllerApi(config())
          .userInfo()
          .then((res) => res.data)
          .then((data) => {
            account.updateUser(data.payload);
          });
      }
    }
  );
  watch(
    () => account.enableSync,
    (newValue) => {
      if (newValue) {
        // 获取服务器数据
        new StorageControllerApi(config())
          .get()
          .then((res) => {
            dataLoading = true;
            return res.data.payload;
          })
          .then((data) => {
            if (data.id > account.dataVersion) {
              const objs = JSON.parse(data.content);
              projectStore.deserialize(objs);
              account.dataVersion = data.id;
              notify.removeNotify(KEYS.GET_DATA_FAILED);
            }
          })
          .catch((e) => {
            notify.addNotify(KEYS.GET_DATA_FAILED, '获取数据失败,请检查网络连接');
            console.error(e);
          })
          .finally(() => {
            dataLoading = false;
          });
      }
    },
    {
      immediate: true
    }
  );
}

/**
 * 刷新或者启动时加载本地数据
 */
export function useLoadLocalData() {
  const data = localStorage.getItem('data');
  if (data) {
    const objs = JSON.parse(data);
    dataLoading = true;
    useProjectStore().deserialize(objs);
    dataLoading = false;
  }
}

/**
 * 监听项目数据变化,当有更改时实时保存
 */
export function useListenDataChange() {
  const account = useAccount();
  const projectStore = useProjectStore();
  const notify = useNotify();
  const fnc = useDebounceFn(() => {
    if (dataLoading) return;
    // 将数据写入本地
    const obj = projectStore.serialize();
    const data = JSON.stringify(obj);
    localStorage.setItem('data', data);
    // 将数据写入服务器
    if (account.enableSync) {
      new StorageControllerApi(config())
        .put({
          uploadAt: new Date().toJSON(),
          content: data,
          dataVersion: account.dataVersion ?? 0
        })
        .then((r) => r.data.payload)
        .then((id) => {
          account.dataVersion = id;
          notify.removeNotify(KEYS.PUT_DATA_FAILED);
        })
        .catch((e) => {
          notify.addNotify(KEYS.PUT_DATA_FAILED, '保存数据失败,请检查网络连接');
          console.error(e);
        });
    }
  }, 2000);
  onMounted(() => {
    projectStore.$subscribe(fnc);
  });
}
