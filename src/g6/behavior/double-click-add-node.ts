import type {IG6GraphEvent} from "@antv/g6-core";
import type {Caller} from "@/g6/hebavior";

export default {
    getEvents() {
        return {
            'dblclick': 'onDoubleClick'
        }
    },

    onDoubleClick(this: Caller, e: IG6GraphEvent) {
        if (e.target?.isCanvas?.()) {
            // let task = new Task('uname task', Math.floor((e.x ) / 120), e.y)
            // store.addTask(getProjectId(), task)
        }
        if (e.item?.getType() === 'node') {
            console.log("node")
        }
    },
}