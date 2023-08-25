import type {IG6GraphEvent} from "@antv/g6-core";
import type {Caller} from "@/g6/hebavior";
import {useGlobalStore} from "@/store/global";
import {v4 as uuidv4} from 'uuid'


export default {

    getEvents() {
        return {
            'dblclick': 'onDoubleClick'
        }
    },

    onDoubleClick(this: Caller, e: IG6GraphEvent) {
        const store = useGlobalStore()
        if (e.target?.isCanvas?.()) {
            store.currentProjectAddTask({
                name: 'uname task',
                id: uuidv4(),
                dataIndex: Math.floor(e.x / 120),
                y: e.y,
                children: []
            })
        }
        if (e.item?.getType() === 'node') {
            // todo show details
            console.log("node", e.item)
        }
    },
}