import { Extensions, IG6GraphEvent, IGraph } from '@antv/g6'
import { createDOM } from '@antv/g6/lib/util/dom'
import { createApp, ref } from 'vue'
import GraphEditor from '@renderer/component/GraphEditor.vue'
import ElementPlus from 'element-plus'
import { PNode } from '@renderer/model'

export class EditorPlugin extends Extensions.BasePlugin {
  visible = ref(false)
  active = ref(new PNode().toGraphNode().data)

  get container() {
    return this.options.container as HTMLElement
  }

  createEditor() {
    const app = createApp(GraphEditor)
    app.use(ElementPlus)
    app.config.errorHandler = (e) => {
      console.log('editor', e)
    }
    app.provide('visible', this.visible)
    app.provide('active', this.active)
    const root = createDOM('<div/>')
    app.mount(root)
    return root
  }

  init(graph: IGraph) {
    super.init(graph)
    const editor = this.createEditor()
    this.graph.container.append(editor)
  }

  getEvents() {
    return {
      'node:dblclick': this.nodeDbClick
    }
  }

  nodeDbClick(e: IG6GraphEvent) {
    this.visible.value = true
    const nodeModel = this.graph.getNodeData(e.itemId)
    if (nodeModel) {
      const node = nodeModel.data
      this.active.value = new Proxy(node, {
        get: (target, p) => {
          return Reflect.get(target, p)
        },
        set: (target, p, newValue) => {
          Reflect.set(target, p, newValue)
          this.graph.updateData('node', {
            id: e.itemId,
            data: target
          })
          return true
        }
      })
    }
  }
}
