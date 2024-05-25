import { shallowRef, type Ref } from "vue";
import { invoke } from '@tauri-apps/api'

export function isTauri() {
    return import.meta.env?.VITE_TAURI === 'true'
}

export function useInvoke<T>(method: string, ...args: []): Ref<T | null> {
    const result = shallowRef<T | null>(null)

    invoke(method, ...args).then(response => {
        console.log(response)
        result.value = response
    })

    return result
}