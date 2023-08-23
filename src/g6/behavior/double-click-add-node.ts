import type {IG6GraphEvent} from "@antv/g6-core";
import type {Caller} from "@/g6/behavior/hebavior";
import {v4 as uuidv4} from 'uuid'
import store from "@/store";

export default {
    getEvents() {
        return {
            'dblclick': 'onDoubleClick'
        }
    },

    onDoubleClick(this: Caller, e: IG6GraphEvent) {
        if (e.target?.isCanvas?.()) {
            let node = {
                x: Math.floor(e.x / 120) * 120 + 60,
                y: e.y,
                label: 'uname task',
                id: uuidv4()
            };
            this.graph.addItem("node", node)
            console.log(node)
        }
        if (e.item?.getType() === 'node') {
            console.log("node")
        }
    }
}