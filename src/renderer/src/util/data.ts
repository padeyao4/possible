import {useStore} from "@renderer/store/project";
import {CURRENT_DATA_VERSION} from "@renderer/common/constant";

/**
 * 将store project 按格式导出
 */
export function dumps(id: string | undefined = undefined) {
    const store = useStore()
    return JSON.stringify({
        data: (id ? [store.get(id)] : store.projects),
        time: new Date().getTime(),
        version: CURRENT_DATA_VERSION
    })
}

/**
 * 加载字符串数据
 * @param text
 */
export function loads(text: string | undefined | null) {
    if (text === undefined || text === null) return
    const content = JSON.parse(text)
    if (content.version !== CURRENT_DATA_VERSION) return;
    useStore().merge(content.data)
}
