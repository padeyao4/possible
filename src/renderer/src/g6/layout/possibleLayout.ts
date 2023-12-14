import G6 from '@antv/g6'
import {PEdge, PNode} from "@renderer/model";
import {graphLayout} from "@renderer/util/data";

G6.registerLayout('possible-layout', {
  /**
   * 定义自定义行为的默认参数，会与用户传入的参数进行合并
   */
  getDefaultCfg() {
    return {
      todayIndex: this.index
    }
  },

  /**
   * 执行布局
   */
  execute() {
    const {
      todayIndex,
      nodes,
      edges
    }: {
      todayIndex: number
      nodes: PNode[]
      edges: PEdge[]
    } = this
    graphLayout({index: todayIndex, nodes, edges})
  },
  /**
   * 销毁
   */
  destroy() {
    return
  }
})
