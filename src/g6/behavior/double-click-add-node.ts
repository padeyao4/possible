// @ts-nocheck
export default {
    getEvents() {
        return {
            'dblclick': 'onCreateNode',
        }
    },

    onCreateNode(e: any) {
        if (e.target?.isCanvas?.()) {
            this.graph.addItem("node", {
                x: Math.floor(e.x / 120) * 120 + 60,
                y: e.y,
                // todo set id
                id: `node-${e.x}-${e.y}`
            })
        }
        if (e.item?.getType() === 'node') {
            this.getDefaultCfg().functionName?.()
        }
    }
}