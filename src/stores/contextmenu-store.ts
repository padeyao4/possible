import { defineStore } from 'pinia'
import { computed, reactive, ref, shallowRef } from 'vue'
import {
  addNode,
  createNodeTemplate,
  currentProject,
  deleteEdgeById,
  deleteNodeById
} from '@/stores/service/project.service'
import { useSettings } from '@/stores/settings'


const items = reactive({
  canvas: {
    '添加': () => {
      const settings = useSettings()
      const project = currentProject()
      const contextmenu = useCanvasContextMenu()
      const x = contextmenu.mouseEvent.offsetX - project.offset.x
      const y = contextmenu.mouseEvent.offsetY - project.offset.y
      const node = createNodeTemplate()
      node.x = Math.floor(x / settings.unitWidth)
      node.y = Math.floor(y / settings.unitHeight)
      addNode(project, node)
    }
  },
  node: {
    '删除': () => {
      const contextmenu = useCanvasContextMenu()
      const project = currentProject()
      const el = contextmenu.mouseEvent.target as Element
      const key = el.getAttribute('data-key')
      deleteNodeById(project, key)
    }
  },
  edge: {
    '删除': () => {
      const contextmenu = useCanvasContextMenu()
      const project = currentProject()
      const el = contextmenu.mouseEvent.target as Element
      const key = el.getAttribute('data-key')
      deleteEdgeById(project, key)
    }
  }
})

export const useCanvasContextMenu = defineStore('canvasContextMenu', () => {
  const element = shallowRef<Element>()
  const active = ref<'canvas' | 'node' | 'edge'>('canvas')
  const visible = ref(false)
  const clientX = ref(0)
  const clientY = ref(0)
  const mouseEvent = shallowRef<MouseEvent>()

  const bounding = computed(() => {
    return element.value?.getBoundingClientRect()
  })

  const list = computed(() => {
    return items[active.value]
  })

  function setElement(el: Element) {
    element.value = el
  }

  function setActive(a: 'canvas' | 'node' | 'edge') {
    active.value = a
  }

  return {
    visible,
    list,
    clientX,
    clientY,
    bounding,
    setElement,
    setActive,
    mouseEvent
  }
})