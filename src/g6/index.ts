import G6 from "@antv/g6";
import PossibleNodeDrag from "./behavior/possible-node-drag";
import PossibleLayout from "./layout/possible-layout";

const behaviors: Record<string, any> = {
    "possible-drag-node": PossibleNodeDrag,
}

export function registerBehaviors() {
    for (let key in behaviors) {
        G6.registerBehavior(key, behaviors[key])
    }
}

export function registerLayout() {
    G6.registerLayout('possible-layout', PossibleLayout)
}