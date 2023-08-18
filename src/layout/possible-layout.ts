export default {
    _cfg: {},
    /**
     * 定义自定义行为的默认参数，会与用户传入的参数进行合并
     */
    getDefaultCfg() {
        return {};
    },
    /**
     * 初始化
     */
    init(data: any) {
        let self = this
        self.set('nodes', data.nodes)
    },
    /**
     * 执行布局,
     * 自定义布局，x轴方向没有作用力，当x轴相同时在y轴方向有相互斥力
     */
    execute() {
        let self = this
        console.log("execute", self.get('nodes'))
        let nodes: any[] = self.get('nodes')
        let groups = {}
        nodes.forEach(n => {
            groups[n.x] = groups[n.x] || []
            groups[n.x].push(n)
        })
        // todo 设置布局斥力
        console.log("groups", groups)
    },
    /**
     * 根据传入的数据进行布局
     * @param {object} data 数据
     */
    layout(data: any) {
        console.log("layout", data)
    },
    /**
     * 更新布局配置，但不执行布局
     * @param {object} cfg 需要更新的配置项
     */
    updateCfg(cfg: any) {
        console.log("update cfg")
    },
    /**
     * 销毁
     */
    destroy() {
        let self = this
        self._cfg = {}
        console.log("destroy")
    },

    get(k: string) {
        return this._cfg?.[k];
    },
    set(k: string, v: object) {
        this._cfg[k] = v
    }
}