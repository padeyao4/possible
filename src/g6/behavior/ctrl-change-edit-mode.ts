export default {

    getEvents() {
        return {
            'keydown': 'onCtrlDown',
            'keyup': 'onCtrlUp'
        }
    },
    onCtrlDown(e: any) {
        //@ts-ignore
        let graph = this.graph
        if (e.key === 'Control') {
            graph.setMode('edit')
        }
    },
    onCtrlUp(e: any) {
        //@ts-ignore
        let {graph} = this
        if (e.key === 'Control') {
            graph.setMode?.('default')
        }
    }
}