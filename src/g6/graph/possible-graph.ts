import {Graph} from "@antv/g6";
import PossibleGrid from "../plugin/possible-grid";
import type {GraphData} from "@antv/g6-core/lib/types";
import type {IG6GraphEvent} from "@antv/g6-core";

export default class PossibleGraph {
    /**
     * The distance between nodes is gap x 2
     */
    public readonly gap = 10
    /**
     * graph node size
     */
    public readonly nodeSize = [100, 40]
    public readonly scale = 99
    public readonly mountPointHeightOffset = 8

    graph: Graph
    container: HTMLElement

    constructor(mountPoint: HTMLElement) {
        this.container = mountPoint
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
                    type: 'double-click',
                    // trigger: () => console.log('trigger function'),
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

    /**
     * origin x on canvas
     */
    originX() {
        return this.graph.getPointByCanvas(0, 0).x
    }

    updateGraph(data: GraphData) {
        this.graph.read(data)
    }

    currentMode() {
        return this.graph.getCurrentMode()
    }

    translateX(dx: number) {
        this.graph.translate(dx, 0)
    }

    destroy() {
        this.graph.destroy()
    }

    /**
     * update background canvas
     */
    updateBG() {
        this.graph.emit('viewportchange')
    }

    updateCanvasSize() {
        this.graph.changeSize(this.container.clientWidth, this.container.clientHeight - this.mountPointHeightOffset)
    }

    on(eventName: string, callback: (e: IG6GraphEvent) => void) {
        this.graph.on(eventName, callback)
    }
}