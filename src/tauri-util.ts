import { shallowRef, type Ref } from "vue";
import { invoke } from '@tauri-apps/api'
import {
    isPermissionGranted,
    requestPermission,
    sendNotification
} from '@tauri-apps/api/notification'

export function isTauri() {
    return import.meta.env?.VITE_TAURI === 'true'
}

export function useInvoke<T>(method: string, ...args: []): Ref<T | null> {
    const result = shallowRef<T | null>(null)

    invoke(method, ...args).then(response => {
        result.value = response
    })

    return result
}

export async function sendNotiflyMessage(title: string, body?: string) {
    let permissionGranted = await isPermissionGranted()
    if (!permissionGranted) {
        const permission = await requestPermission()
        permissionGranted = permission === 'granted'
    }
    if (permissionGranted) {
        sendNotification({ title, body })
    }
}