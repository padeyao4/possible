export default {
    getEvents() {
        return {
            'keydown': 'onCtrlDown',
            'keyup': 'onCtrlUp'
        }
    },
    onCtrlDown(e) {
        let {graph} = this
        if (e.key === 'Control') {
            graph.setMode('edit')
        }
    },
    onCtrlUp(e) {
        let {graph} = this
        if (e.key === 'Control') {
            graph.setMode('default')
        }
    }
}