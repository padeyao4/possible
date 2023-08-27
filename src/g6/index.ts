import G6 from "@antv/g6";
import PossibleNodeDrag from "./behavior/possible-node-drag";
import PossibleLayout from "./layout/possible-layout";
import ClickAddEdge from "@/g6/behavior/click-add-edge";

const behaviors: Record<string, any> = {
    "possible-drag-node": PossibleNodeDrag,
    'click-add-edge': ClickAddEdge
}

export function registerBehaviors() {
    for (let key in behaviors) {
        G6.registerBehavior(key, behaviors[key])
    }
}

export function registerLayout() {
    G6.registerLayout('possible-layout', PossibleLayout)
}