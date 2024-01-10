import { Extensions, IGraph } from '@antv/g6'
import { createDOM } from '@antv/g6/lib/util/dom'
import { createApp } from 'vue'
import GraphEditor from '@renderer/component/GraphEditor.vue'
import { renderToString } from 'vue/server-renderer'

export class EditorPlugin extends Extensions.BasePlugin {
  get container() {
    return this.options.container as HTMLElement
  }

  async init(graph: IGraph) {
    super.init(graph)
    // todo 服务端渲染
    const component = createApp(GraphEditor)
    const editor = createDOM(await renderToString(component))
    this.graph.container.append(editor)
  }
}
