import { UNIT_W } from '@/configs/constant'
import type { CustomGraph } from '@/g6/core/graph'
import { dateToX } from '@/utils/time'
import type { ID } from '@antv/g6'
import { dayjs } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, reactive, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

export interface Node {
  id: ID
  data: Record<string, any>
}

export interface Edge {
  id: ID
  source: ID
  target: ID
  data: Record<string, any>
}

export interface Project {
  id: string
  name: string
  nodesMap: Map<ID, Node>
  edgesMap: Map<ID, Edge>
  inEdgesMap: Map<ID, Set<Edge>>
  outEdgesMap: Map<ID, Set<Edge>>
  rowsMap: Map<ID, Set<Node>>
  colsMap: Map<ID, Set<Node>>
  coordinateMap: Map<string, Node>
  completed: boolean
  sortIndex: number
  editable: boolean
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
    const oldNode = currentProject.value.nodesMap.get(model.id)

    const { colsMap, rowsMap, coordinateMap } = currentProject.value

    const { x: oldX, y: oldY } = oldNode.data

    colsMap.get(oldX).delete(oldNode)
    rowsMap.get(oldY).delete(oldNode)
    coordinateMap.delete(`${oldX},${oldY}`)

    const { x: newX, y: newY } = model.data
    if (colsMap.has(newX)) {
      colsMap.get(newX).add(oldNode)
    } else {
      colsMap.set(newX, new Set([oldNode]))
    }

    rowsMap.get(oldY).delete(oldNode)
    if (rowsMap.has(newY)) {
      rowsMap.get(newY).add(oldNode)
    } else {
      rowsMap.set(newY, new Set([oldNode]))
    }
    coordinateMap.set(`${newX},${newY}`, oldNode)

    Object.assign(oldNode.data, model.data)
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
    const { nodesMap, inEdgesMap, outEdgesMap, rowsMap, colsMap, coordinateMap } = currentProject.value;
    const { x, y } = model.data
    if (coordinateMap.has(`${x},${y}`)) return

    coordinateMap.set(`${x},${y}`, model)
    nodesMap.set(model.id, model)
    inEdgesMap.set(model.id, new Set())
    outEdgesMap.set(model.id, new Set())

    if (x in colsMap) {
      colsMap.get(x)?.add(model)
    } else {
      colsMap.set(x, new Set([model]))
    }
    if (y in rowsMap) {
      rowsMap.get(y)?.add(model)
    } else {
      rowsMap.set(y, new Set([model]))
    }

    graph.value?.addData('node', model)
  }

  const removeNode = (nodeId: ID) => {
    if (!currentProject.value) return

    const { outEdgesMap, inEdgesMap, nodesMap, edgesMap, rowsMap, colsMap, coordinateMap } = currentProject.value

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

    const node = nodesMap.get(nodeId)
    coordinateMap.delete(`${node.data.x},${node.data.y}`)
    rowsMap.get(node.data.x)?.delete(node)
    colsMap.get(node.data.y)?.delete(node)
    nodesMap.delete(nodeId)

    graph.value?.removeData('node', nodeId)
  }

  const bfsOutEdge = (startNodeId: ID, project: Project, callback: (id: ID) => void) => {
    const queue = [startNodeId]
    while (queue.length > 0) {
      const nodeId = queue.shift()
      callback(nodeId)
      project.outEdgesMap.get(nodeId)?.forEach((edge) => {
        if (!queue.includes(project.nodesMap.get(edge.target).id)) {
          queue.push(project.nodesMap.get(edge.target).id)
        }
      })
    }
  }

  const bfsInEdge = (startNodeId: ID, project: Project, callback: (id: ID) => void) => {
    const queue = [startNodeId]
    while (queue.length > 0) {
      const nodeId = queue.shift()
      callback(nodeId)
      project.inEdgesMap.get(nodeId)?.forEach((edge) => {
        if (!queue.includes(project.nodesMap.get(edge.source).id)) {
          queue.push(project.nodesMap.get(edge.source).id)
        }
      })
    }
  }

  const bfsAllNodes = (startNodeId: ID, project: Project, callback: (id: ID) => void) => {
    const visited = new Set<ID>()
    visited.add(startNodeId)
    const queue = [startNodeId]
    const { nodesMap, inEdgesMap, outEdgesMap } = project
    while (queue.length > 0) {
      const nodeId = queue.shift()
      callback(nodeId)
      outEdgesMap.get(nodeId)?.forEach((edge) => {
        const targetId = nodesMap.get(edge.target).id
        if (!visited.has(targetId)) {
          queue.push(targetId)
          visited.add(targetId)
        }
      })
      inEdgesMap.get(nodeId)?.forEach((edge) => {
        const sourceId = nodesMap.get(edge.source).id
        if (!visited.has(sourceId)) {
          queue.push(sourceId)
          visited.add(sourceId)
        }
      })
    }
  }

  const getRelationNodes = (nodeId: ID, project: Project) => {
    const allNodeIds = []
    bfsAllNodes(nodeId, project, (id) => allNodeIds.push(id))
    return allNodeIds
  }

  const getNeighbors = (id: ID, project: Project) => {
    return [...getSuccessors(id, project), ...getPredecessors(id, project)]
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

  const checkNodeOverlap = (node: Partial<Node>, project: Project) => {
    const { coordinateMap } = project
    return coordinateMap.has(`${node.data.x},${node.data.y}`)
  }

  /**
   * 当前节点的所有关联节点都向下移动,向下移动碰到重叠节点。递归重叠节点向下移动
   */
  const moveDown = (node: Node, project: Project) => {
    // todo
  }

  /**
   * 向右移动,如果有重叠节点,重叠节点和重叠节点的关联节点都向下移动
   */
  const moveRight = (nodeId: ID, project: Project, drawabled = true) => {
    const node = project.nodesMap.get(nodeId)
    getSuccessors(node.id, project)
      .filter(successor => {
        return successor.data.x - node.data.x === UNIT_W
      })
      .forEach(successor => {
        moveRight(successor.id, project, drawabled)
      })
    // todo 解决重叠问题
    // const nextX = node.data.x + UNIT_W
    // if (checkNodeOverlap({
    //   data: { x: nextX, y: node.data.y }
    // }, project)) {
    //   const overlapNode = project.coordinateMap.get(`${nextX},${node.data.y}`)

    // }
    node.data.x += UNIT_W
    // todo end
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
    getCurrentX,
    checkNodeOverlap,
    bfsOutEdge,
    bfsInEdge,
    bfsAllNodes,
    getRelationNodes
  }
}
)

