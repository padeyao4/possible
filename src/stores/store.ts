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

const UNIT = 120

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

  const updateData = (itemType: 'node' | 'edge', models: Node | Edge | Node[] | Edge[]) => {
    const project = currentProject.value
    if (!project) return

    (Array.isArray(models) ? models : [models]).forEach(item => {
      const { id } = item
      if (itemType === 'node') {
        Object.assign(project.nodesMap.get(id).data, item.data)
      }
      // todo 
      // if (itemType === 'edge') {
      //   const newEdge = <Edge>item
      //   const id = newEdge.id

      //   const oldEdge = project.edgesMap.get(id)
      //   const oldSource = oldEdge.source
      //   const oldTarget = oldEdge.target

      //   // 修改edgesMap值
      //   Object.assign(oldEdge, newEdge)

      //   const newSource = oldEdge.source
      //   const newTarget = oldEdge.target

      //   if (oldSource !== newSource) {
      //     project.outEdgesMap.get(oldSource)?.delete(oldEdge)
      //     if (newSource in project.outEdgesMap) {
      //       project.outEdgesMap.get(newSource)?.add(oldEdge)
      //     } else {
      //       project.outEdgesMap.set(newSource, new Set([oldEdge]))
      //     }
      //   }

      //   if (oldTarget !== newTarget) {
      //     project.inEdgesMap.get(oldTarget)?.delete(oldEdge)
      //     if (newTarget in project.inEdgesMap) {
      //       project.inEdgesMap.get(newTarget)?.add(oldEdge)
      //     } else {
      //       project.inEdgesMap.set(newTarget, new Set([oldEdge]))
      //     }
      //   }
      // }
    })

    graph.value?.updateData(itemType, models)
  }

  const addData = (itemType: 'node' | 'edge', models: Node | Edge | Node[] | Edge[]) => {
    const project = currentProject.value
    if (!project) return

    (Array.isArray(models) ? models : [models]).forEach(item => {
      if (itemType === 'node') {
        project.nodesMap.set(item.id, item)
        project.inEdgesMap.set(item.id, new Set())
        project.outEdgesMap.set(item.id, new Set())
      }
      if (itemType === 'edge') {
        const edge = <Edge>item
        project.edgesMap.set(edge.id, edge)

        project.inEdgesMap.get(edge.target)?.add(edge)
        project.outEdgesMap.get(edge.source)?.add(edge)

        // project.edges.push(edge)
        // if (project.inEdgesMap.has(edge.target)) {
        //   project.inEdgesMap.get(edge.target).add(edge)
        // } else {
        //   project.inEdgesMap.set(edge.target, new Set([edge]))
        // }

        // if (project.outEdgesMap.has(edge.source)) {
        //   project.outEdgesMap.get(edge.source).add(edge)
        // } else {
        //   project.outEdgesMap.set(edge.source, new Set([edge]))
        // }
      }
    }
    )

    graph.value?.addData(itemType, models)
  }

  const removeData = (itemType: 'node' | 'edge', id: ID | ID[]) => {
    const project = currentProject.value
    if (!project) return
    (Array.isArray(id) ? id : [id]).forEach(itemId => {
      if (itemType === 'node') {
        project.outEdgesMap.get(itemId)?.forEach((edge) => {
          project.inEdgesMap.get(edge.target)?.delete(edge)
          project.edgesMap.delete(edge.id)
        })

        project.inEdgesMap.get(itemId)?.forEach((edge) => {
          project.outEdgesMap.get(edge.source)?.delete(edge)
          project.edgesMap.delete(edge.id)
        })

        project.outEdgesMap.delete(itemId)
        project.inEdgesMap.delete(itemId)
        project.nodesMap.delete(itemId)

        // project.nodesMap.delete(item)
      } // todo
      // if (itemType === 'edge') {
      //   const edge = project.edgesMap.get(item)
      //   const source = edge.source
      //   const target = edge.target
      //   project.edgesMap.delete(item)
      //   project.inEdgesMap.get(target)?.delete(edge)
      //   project.outEdgesMap.get(source)?.delete(edge)
      // }
    })
    graph.value?.removeData(itemType, id)
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
        return successor.data.x - node.data.x === UNIT
      })
      .forEach(successor => {
        moveRight(successor.id, project, drawabled)
      })
    node.data.x += UNIT
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
        return node.data.x - predecessor.data.x === UNIT
      })

    if (predecessors.some((predecessor) => !moveLeft(predecessor.id, project, currentX))) {
      return false
    } else {
      node.data.x -= UNIT
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
    addData,
    updateData,
    removeData,
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

