import {defineStore} from "pinia";

export const useSettingsStore = defineStore('settings', {
    state() {
        return {
            /**
             * 是否开启实验功能
             */
            experiment: true,
            /**
             * 开启自动更新时间
             */
            autoUpdateDate: true
        }
    }
})
