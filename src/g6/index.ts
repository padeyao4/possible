import G6 from "@antv/g6";
import PossibleNodeDrag from "./behavior/possible-node-drag";
import PossibleLayout from "./layout/possible-layout";
import DoubleClickAddNode from "./behavior/double-click-add-node";
import CtrlChangeEditMode from "./behavior/ctrl-change-edit-mode";

const behaviors: Record<string, any> = {
    "possible-drag-node": PossibleNodeDrag,
    'double-click': DoubleClickAddNode,
    'ctrl-change-edit-mode': CtrlChangeEditMode
}

export function registerBehaviors() {
    for (let key in behaviors) {
        G6.registerBehavior(key, behaviors[key])
    }
}

export function registerLayout() {
    G6.registerLayout('possible-layout', PossibleLayout)
}

export function registerAll() {
    registerBehaviors()
    registerLayout()
}
