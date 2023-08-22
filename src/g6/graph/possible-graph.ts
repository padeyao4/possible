import {Graph} from "@antv/g6";
import PossibleGrid from "../plugin/possible-grid";

export default class PossibleGraph {
    /**
     * graph node size
     */
    public nodeSize = [100, 40]
    public scale = 99
    public mountPointHeightOffset = 8

    graph: Graph

    constructor(mountPoint: any, f: string) {
        this.graph = new Graph({
            container: mountPoint,
            width: mountPoint.clientWidth,
            height: mountPoint.clientHeight - this.mountPointHeightOffset,
            plugins: [new PossibleGrid()],
            modes: {
                default: [{
                    type: 'drag-canvas',
                    allowDragOnItem: true,
                    enableOptimize: true,
                    scalableRange: this.scale,
                }, {
                    type: 'double-click-add-node',
                    functionName: f,
                }, 'ctrl-change-edit-mode'],
                edit: ['ctrl-change-edit-mode', 'possible-drag-node']
            },
            defaultNode: {
                type: 'rect',
                size: this.nodeSize,
                style: {
                    fill: '#91d2fb',
                    lineWidth: 1,
                },
            },
            defaultEdge: {
                type: 'cubic-horizontal',
            },
            layout: {
                type: 'possible-layout'
            }
        });
    }
}