import { Extensions } from '@antv/g6'
import { normalX, normalY } from '@/utils/position-util.js'
import { v4 } from 'uuid'
import { faker } from '@faker-js/faker'
import { useStore } from '@/stores/store'
import { dateToX } from '@/utils/time'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event) => event.button === 0
}
export default class CreateNode extends Extensions.BaseBehavior {

  store = useStore()

  constructor(options) {
    super(Object.assign({}, DEFAULT_CONFIG, options))
  }

  getEvents() {
    return {
      'canvas:dblclick': this.create
    }
  }

  create(e) {
    if (!this.options.shouldBegin(e)) return

    const { x, y } = e.canvas

    const posX = normalX(x)
    const posY = normalY(y)

    if (this.graph.checkNodeOverlap(posX, posY)) {
      return
    }

    const proeject = this.store.currentProject
    const currentX = dateToX(this.store.currentTime, proeject.createTime)

    this.graph.addData('node', {
      id: v4(),
      data: {
        name: faker.person.fullName(),
        x: posX,
        y: posY,
        detail: '',
        record: '',
        completed: posX < currentX,
        sortedIndex: -1,
        project: {
          id: proeject.id,
          name: proeject.name
        }
      }
    })
  }
}