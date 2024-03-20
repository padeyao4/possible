import { UNIT_W } from '@/configs/constant'
import type { CustomGraph } from '@/g6/core/graph'
import { dateToX } from '@/utils/time'
import type { ID } from '@antv/g6'
import { dayjs } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, reactive, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

export interface Node {
  id: ID,
  data: Record<string, any>
}

export interface Edge {
  id: ID
  source: ID,
  target: ID,
  data: Record<string, any>
}

export interface Project {
  id: string,
  name: string,
  nodesMap: Map<ID, Node>,
  edgesMap: Map<ID, Edge>,
  inEdgesMap: Map<ID, Set<Edge>>,
  outEdgesMap: Map<ID, Set<Edge>>,
  rowsMap: Map<ID, Set<Node>>,
  colsMap: Map<ID, Set<Node>>,
  completed: boolean,
  sortIndex: number,
  editable: boolean,
  createTime: number
}


/**
 * Defines a Pinia store that manages project state.
 *
 * Includes computed values, refs, and methods for:
 * - Getting the current project based on route params
 * - Tracking the selected tab
 * - Getting the current date/time
 * - Adding new projects
 * - Incrementing the current date/time
 */
export const useStore = defineStore('store', () => {

  const projects = reactive<Record<string, Project>>({})

  const selected = ref<string>('today')

  const currentTime = ref(new Date())

  const graph = shallowRef<CustomGraph>()

  const selectedNode = ref<Node>()

  const actionState = ref<'none' | 'dragend' | 'edit' | 'contextmenu'>('none')

  const mousePosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })

  const currentProject = computed<Project>(() => {
    const { id } = useRoute().params
    return projects[id as string]
  })

  const contextmenuPosition = computed(() => {
    return graph.value?.getClientByCanvas(mousePosition.value)
  })

  const updateNode = (model: Node) => {
    if (!currentProject.value) return
    Object.assign(currentProject.value.nodesMap.get(model.id).data, model.data)
    graph.value?.updateData('node', model)
  }

  const addEdge = (model: Edge) => {
    if (!currentProject.value) return
    const { edgesMap, inEdgesMap, outEdgesMap } = currentProject.value;
    edgesMap.set(model.id, model)
    inEdgesMap.get(model.target)?.add(model)
    outEdgesMap.get(model.source)?.add(model)
    graph.value?.addData('edge', model)
  }

  const addNode = (model: Node) => {
    if (!currentProject.value) return
    const { nodesMap, inEdgesMap, outEdgesMap, rowsMap, colsMap } = currentProject.value;

    nodesMap.set(model.id, model)
    inEdgesMap.set(model.id, new Set())
    outEdgesMap.set(model.id, new Set())
    const { x, y } = model.data
    if (x in colsMap) {
      rowsMap.get(x)?.add(model)
    } else {
      rowsMap.set(x, new Set([model]))
    }
    if (y in rowsMap) {
      colsMap.get(y)?.add(model)
    } else {
      colsMap.set(y, new Set([model]))
    }

    graph.value?.addData('node', model)
  }

  const removeNode = (nodeId: ID) => {
    if (!currentProject.value) return

    const { outEdgesMap, inEdgesMap, nodesMap, edgesMap } = currentProject.value

    outEdgesMap.get(nodeId)?.forEach((edge) => {
      inEdgesMap.get(edge.target)?.delete(edge)
      edgesMap.delete(edge.id)
    })

    inEdgesMap.get(nodeId)?.forEach((edge) => {
      outEdgesMap.get(edge.source)?.delete(edge)
      edgesMap.delete(edge.id)
    })

    outEdgesMap.delete(nodeId)
    inEdgesMap.delete(nodeId)
    nodesMap.delete(nodeId)

    graph.value?.removeData('node', nodeId)
  }


  const getNeighbors = (id: ID, project: Project) => {
    return [...new Set([...getSuccessors(id, project), ...getPredecessors(id, project)])]
  }

  const getSuccessors = (id: ID, project: Project) => {
    const { outEdgesMap, nodesMap } = project
    return [...outEdgesMap.get(id) ?? []].map(edge => {
      return nodesMap.get(edge.target)
    })
  }

  const getPredecessors = (id: ID, project: Project) => {
    const { inEdgesMap, nodesMap } = project;
    return [...inEdgesMap.get(id) ?? []].map(edge => nodesMap.get(edge.source))
  }

  /**
   * Updates the graph value to the provided custom graph.
   */
  const updateGraph = (custom: CustomGraph) => {
    graph.value = custom
  }

  const setSelected = (value: string) => {
    selected.value = value
  }

  const isActive = (value: string) => {
    return selected.value === value
  }

  /**
   * Adds a new project to the projects map/object.
   * @param project - The project object to add.
   * @returns The id of the added project.
   */
  const addProject = (project: Project) => {
    projects[project.id] = project
    return project.id
  }

  /**
   * Adds the specified number of days to the current date/time.
   *
   * @param days - The number of days to add.
   * @returns The updated date/time after adding the days.
   */
  const addDays = (days: number) => {
    return (currentTime.value = dayjs(currentTime.value).add(days, 'd').toDate())
  }

  const updateTime = () => {
    currentTime.value = new Date()
  }

  const moveRight = (nodeId: ID, project: Project, drawabled = true) => {
    const node = project.nodesMap.get(nodeId)
    getSuccessors(node.id, project)
      .filter(successor => {
        return successor.data.x - node.data.x === UNIT_W
      })
      .forEach(successor => {
        moveRight(successor.id, project, drawabled)
      })
    node.data.x += UNIT_W
    if (drawabled) {
      graph.value?.updateNodePosition({
        id: nodeId,
        data: { x: node.data.x, y: node.data.y }
      })
    }
  }

  const getCurrentX = (project: Project) => {
    return dateToX(currentTime.value, project.createTime)
  }

  const moveLeft = (nodeId: ID, project: Project, currentX: number) => {
    const node = project.nodesMap.get(nodeId)
    if (node.data.completed || node.data.x <= currentX) {
      return false
    }

    const predecessors = getPredecessors(nodeId, project)
      .filter((predecessor) => {
        return node.data.x - predecessor.data.x === UNIT_W
      })

    if (predecessors.some((predecessor) => !moveLeft(predecessor.id, project, currentX))) {
      return false
    } else {
      node.data.x -= UNIT_W
      graph.value.updateNodePosition({
        id: nodeId,
        data: { x: node.data.x, y: node.data.y }
      })
      return true
    }
  }

  const dailyUpdate = () => {
    console.log('start daily update');
    Object.values(projects).forEach((project) => {
      const currentX = dateToX(currentTime.value, project.createTime)
      let nodes = [...project.nodesMap.values()]
        .filter((node) => node.data.x < currentX && !node.data.completed)
        .sort((a, b) => a.data.x - b.data.x)
      while (nodes.length > 0) {
        moveRight(nodes[0].id, project, project === currentProject.value)
        nodes = [...project.nodesMap.values()]
          .filter((node) => node.data.x < currentX && !node.data.completed)
          .sort((a, b) => a.data.x - b.data.x)
      }
    })
    console.log('daily update done')
  }


  return {
    projects,
    currentProject,
    currentTime,
    selectedNode,
    actionState,
    mousePosition,
    contextmenuPosition,
    updateGraph,
    updateNode,
    addNode,
    addEdge,
    removeNode,
    isActive,
    setSelected,
    addProject,
    addDays,
    updateTime,
    getSuccessors,
    getPredecessors,
    getNeighbors,
    moveRight,
    moveLeft,
    dailyUpdate,
    getCurrentX
  }
}
)

