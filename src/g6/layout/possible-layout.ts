// import {INode} from "@antv/g6-core";

export default class {
    private nodes: any[]
    /**
     * 最小移动常量
     */
    public minMovement: number = 0.5
    /**
     * 总共移动变量
     */
    private totalMovement: number

    private timeInterval: number


    /**
     * 定义自定义行为的默认参数，会与用户传入的参数进行合并
     */
    public getDefaultCfg() {
        return {};
    }

    /**
     * 初始化
     */
    public init(data: any) {
        let self = this
        let {nodes} = data
        self.nodes = nodes
    }

    /**
     * 执行布局,
     * 自定义布局，x轴方向没有作用力，当x轴相同时在y轴方向有相互斥力
     */
    public execute() {
        let self = this
        let nodes: any[] = self.nodes

        let groups = {}
        nodes.forEach(n => {
            groups[n.x] = groups[n.x] || []
            groups[n.x].push(n)
        })

        // if (self.timeInterval !== undefined && typeof window !== "undefined") {
        //     window.clearInterval(self.timeInterval)
        // }
        //
        // self.timeInterval = window.setInterval(self.run.bind(self), 0, groups)
        // if (this.totalMovement <= this.minMovement) {
        //     window.clearInterval(self.timeInterval)
        // }
        self.run(groups)
        console.log("groups", groups)
    }

    run(groups: object) {
        console.log('run')
        Object.keys(groups).forEach(k => {
            let nodes: any[] = groups[k]
            // 由小到大排序
            nodes.sort((a, b) => a.y - b.y)
            return nodes.reduce((a, b) => {
                let dst = Math.abs(a.y - b.y)
                console.log("a", a.y, "b", b.y)
                if (dst >= 60) return 0

                let delta = (60 - dst) / 2
                // todo 自定义布局不生效
                a.y -= delta;
                b.y += delta
                console.log("delta",delta)
                return delta
            })
        })
    }

    /**
     * 根据传入的数据进行布局
     * @param {object} data 数据
     */
    public layout(data: any) {
        console.log("layout", data)
        this.execute()
    }

    /**
     * 更新布局配置，但不执行布局
     * @param {object} cfg 需要更新的配置项
     */
    public updateCfg(cfg: any) {
        console.log("update cfg")
    }

    /**
     * 销毁
     */
    public destroy() {
        console.log("destroy")
        this.nodes = null
    }

    public getType() {
        return 'possible-layout'
    }
}