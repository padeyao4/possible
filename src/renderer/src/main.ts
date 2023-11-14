import './assets/main.css'
import '@renderer/g6'
import {createPinia} from 'pinia'
import {createApp} from 'vue'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import 'default-passive-events'
import {useProjectStore} from "@renderer/store/project";
import ElementPlus from 'element-plus' // 必须在其他项导入之后
import 'element-plus/dist/index.css'
import '@renderer/util/browser-patch'
import {PossibleData} from "@renderer/types";
import {CURRENT_DATA_VERSION} from "@renderer/common/constant";

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')

;(async function () {
        const projectStore = useProjectStore()
        if (projectStore.projects.length === 0) {
            const s = await window.api.loadLocalData()
            if (s !== null) {
                const data: PossibleData = JSON.parse(s)
                if (data.version === CURRENT_DATA_VERSION) {
                    projectStore.push(data.projects)
                }
            }
        }
    }()
)
