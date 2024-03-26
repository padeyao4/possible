import { Extensions, type IG6GraphEvent } from '@antv/g6'
import { useStore } from '@/stores/store'
import { useRoute } from 'vue-router'
import { createNode } from '@/utils/data-util'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event: any) => event.button === 0
}
export default class CreateNode extends Extensions.BaseBehavior {

  store = useStore()
  route = useRoute()
  currentProject = this.store.projects[this.route.params.id as string]

  constructor(options: any) {
    super(Object.assign({}, DEFAULT_CONFIG, options))
  }

  getEvents() {
    return {
      'canvas:dblclick': this.create
    }
  }

  create(e: IG6GraphEvent) {
    if (!this.options.shouldBegin(e)) return

    const { x, y } = e.canvas

    createNode(x, y, this.currentProject)
  }
}