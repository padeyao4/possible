import {wrapBehavior, each} from '@antv/util'
import {modifyCSS, createDom} from '@antv/dom-util'

export default class PossibleGrid {

    // 网格背景图片
    img =
        'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)';

    constructor() {
        this._cfgs = {}
        this._events = []
        this.destroyed = false
    }

    set(k, v) {
        this._cfgs[k] = v
    }

    get(k) {
        return this._cfgs?.[k]
    }

    /**
     * call by g6 graph
     * @param graph
     */
    initPlugin(graph) {
        console.log("init plugin graph", graph)
        const self = this
        self.set('graph', graph)
        const events = self.getEvents();
        const bindEvents = {}

        each(events, (v, k) => {
            const event = wrapBehavior(self, v)
            bindEvents[k] = event
            graph.on(k, event)
        })
        this._events = bindEvents
        self.init()
    }

    init() {
        const graph = this.get('graph')
        const graphContainer = graph.getContainer()
        const canvas = graph.get('canvas').get('el')
        const container = createDom(
            `<div class='g6-grid-container' style="position:absolute;overflow:hidden;z-index: -1;"></div>`,)
        const gridContainer = createDom(
            `<div
        class='g6-grid'
        style='position:absolute;
        background-image: ${this.img};
        user-select: none
        '></div>`,
        );
        this.set('container', container);
        this.set('gridContainer', gridContainer);

        this.positionInit();

        container.appendChild(gridContainer);
        graphContainer.insertBefore(container, canvas)
    }

    positionInit() {
        const graph = this.get('graph');
        const minZoom = graph.getMinZoom();
        const width = graph.getWidth();
        const height = graph.getHeight();

        modifyCSS(this.get('container'), {
            width: `${width}px`,
            height: `${height}px`,
        });

        // 网格 40*40 需保证 (gridContainerWidth / 2) % 40 = 0 才能让网格线对齐左上角 故 * 80
        const gridContainerWidth = (width * 80) / minZoom;
        const gridContainerHeight = (height * 80) / minZoom;
        modifyCSS(this.get('gridContainer'), {
            width: `${gridContainerWidth}px`,
            height: `${gridContainerHeight}px`,
            left: `-${gridContainerWidth / 2}px`,
            top: `-${gridContainerHeight / 2}px`,
        });
    }

    update(param) {
        const gridContainer = this.get('gridContainer');
        let {matrix} = param;
        if (!matrix) matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

        const isFollow = true; // follow viewport change
        const transform = `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[3]}, ${matrix[4]}, ${isFollow ? matrix[6] : '0'
        }, ${isFollow ? matrix[7] : '0'})`;

        modifyCSS(gridContainer, {
            transform,
        });
    }

    getEvents() {
        return {
            viewportchange: 'update',
        }
    }

    destroyPlugin() {
        const graph = this.get('graph')
        const events = this._events;
        each(events, (v, k) => {
            graph.off(k, v);
        });

        this._events = null
        this._cfgs = null
        this.destroyed = true;
    }
}