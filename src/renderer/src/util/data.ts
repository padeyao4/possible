import {useProjectStore} from "@renderer/store/project";
import {CURRENT_DATA_VERSION} from "@renderer/common/constant";

/**
 * 将store project 按格式导出
 */
export function dumps(id: string | undefined = undefined) {
    const projectStore = useProjectStore()
    return JSON.stringify({
        data: (id ? [projectStore.get(id)] : projectStore.projects),
        time: new Date().getTime(),
        version: CURRENT_DATA_VERSION
    })
}

export function loads(text: string | undefined | null) {
    if (text === undefined || text === null) return
    const content = JSON.parse(text)
    if (content.version !== CURRENT_DATA_VERSION) return;
    useProjectStore().merge(content.data)
}
