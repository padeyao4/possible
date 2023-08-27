import G6 from "@antv/g6";
import PossibleNodeDrag from "./behavior/possible-node-drag";
import PossibleLayout from "./layout/possible-layout";
// import DoubleClickAddNode from "./behavior/double-click-add-node";
import CtrlChangeEditMode from "./behavior/ctrl-change-edit-mode";
import ClickAddEdge from "@/g6/behavior/click-add-edge";
// import PossibleCanvasDrag from "@/g6/behavior/possible-canvas-drag";

const behaviors: Record<string, any> = {
    "possible-drag-node": PossibleNodeDrag,
    // 'double-click': DoubleClickAddNode,
    'ctrl-change-edit-mode': CtrlChangeEditMode,
    // 'possible-drag-canvas': PossibleCanvasDrag
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