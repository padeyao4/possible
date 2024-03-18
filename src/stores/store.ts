import type { ID } from '@antv/g6'
import { dayjs } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, reactive, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
// import { dateToX } from '@/utils/time'
import type { CustomGraph } from '@/g6/core/graph'

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
  completed: boolean,
  sortIndex: number,
  editable: boolean,
  createTime: number
}

/**
 *
 */
const UNIT = 120

// class DataCore {
//   project: Project
//   nodesMap: Map<ID, Node>
//   edgesMap: Map<ID, Edge>
//   sourceMap: Map<ID, ID[]>
//   targetMap: Map<ID, ID[]>
//   indexMap: Map<number, ID[]>
//
//   constructor(project: Project) {
//     this.project = project
//     this.nodesMap = new Map(project.nodes.map((node) => [node.id, node]))
//     this.edgesMap = new Map(project.edges.map((edge) => [edge.id, edge]))
//     this.sourceMap = new Map<ID, ID[]>()
//     this.targetMap = new Map<ID, ID[]>()
//     this.indexMap = new Map<number, ID[]>()
//
//     this.project.edges.forEach((edge) => {
//       const source = edge.source
//       const target = edge.target
//
//       if (this.sourceMap && source in this.sourceMap) {
//         this.sourceMap.get(source)?.push(target)
//       } else {
//         this.sourceMap.set(source, [target])
//       }
//
//       if (this.targetMap && target in this.targetMap) {
//         this.targetMap.get(target)?.push(source)
//       } else {
//         this.targetMap.set(target, [source])
//       }
//     })
//
//     this.project.nodes.forEach(node => {
//       const x = node.data.x
//       if (this.indexMap && x in this.indexMap) {
//         this.indexMap.get(x)?.push(node.id)
//       } else {
//         this.indexMap.set(x, [node.id])
//       }
//     })
//   }
//
//   public getPredecessors(nodeId: ID): ID[] {
//     return this.targetMap.get(nodeId) ?? []
//   }
//
//   /**
//    * Recursively gets all predecessor node IDs for the given node ID.
//    *
//    * @param nodeId - The ID of the node to get predecessors for
//    * @returns An array of all predecessor node IDs
//    */
//   public getAllPredecessors(nodeId: ID): ID[] {
//     const ans: ID[] = []
//     this.getPredecessors(nodeId).forEach((predecessor) => {
//       ans.push(...this.getAllPredecessors(predecessor))
//     })
//     return [...new Set(ans), nodeId]
//   }
//
//   public getSuccessors(nodeId: ID): ID[] {
//     return this.sourceMap.get(nodeId) ?? []
//   }
//
//   public getSuccessorsData(nodeId: ID): Node[] {
//     return this.getNodes(this.getSuccessors(nodeId))
//   }
//
//   public getNode(nodeId: ID): Node | undefined {
//     return this.nodesMap.get(nodeId)
//   }
//
//   /**
//    * Recursively gets all successor nodes for the given node ID.
//    *
//    * It first gets the immediate successors via `getSuccessors`,
//    * then recursively gets the successors of those nodes,
//    * and returns a flattened unique array of all successor node IDs.
//    */
//   public getAllSuccessors(nodeId: ID): ID[] {
//     const ans: ID[] = []
//     this.getSuccessors(nodeId).forEach((successor) => {
//       ans.push(...this.getAllPredecessors(successor))
//     })
//     return [...new Set(ans), nodeId]
//   }
//
//   public getNodes(ids: ID[]) {
//     return ids.map((id) => this.nodesMap.get(id))
//       .filter((node) => node !== undefined) as Node[]
//   }
// }

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
      if (itemType === 'edge') {
        const newEdge = <Edge>item
        const id = newEdge.id

        const oldEdge = project.edgesMap.get(id)
        const oldSource = oldEdge.source
        const oldTarget = oldEdge.target

        // 修改edgesMap值
        Object.assign(oldEdge, newEdge)

        const newSource = oldEdge.source
        const newTarget = oldEdge.target

        if (oldSource !== newSource) {
          project.outEdgesMap.get(oldSource)?.delete(oldEdge)
          if (newSource in project.outEdgesMap) {
            project.outEdgesMap.get(newSource)?.add(oldEdge)
          } else {
            project.outEdgesMap.set(newSource, new Set([oldEdge]))
          }
        }

        if (oldTarget !== newTarget) {
          project.inEdgesMap.get(oldTarget)?.delete(oldEdge)
          if (newTarget in project.inEdgesMap) {
            project.inEdgesMap.get(newTarget)?.add(oldEdge)
          } else {
            project.inEdgesMap.set(newTarget, new Set([oldEdge]))
          }
        }
      }
    })

    graph.value?.updateData(itemType, models)
  }

  const addData = (itemType: 'node' | 'edge', models: Node | Edge | Node[] | Edge[]) => {
    const project = currentProject.value
    if (!project) return

    (Array.isArray(models) ? models : [models]).forEach(item => {
      const { id } = item
      if (itemType === 'node') {
        project.nodesMap.set(id, item)
        // project.nodes.push(item)
      }
      if (itemType === 'edge') {
        const edge = <Edge>item
        project.edgesMap.set(id, edge)
        // project.edges.push(edge)

        if (edge.target in project.inEdgesMap) {
          project.inEdgesMap.get(edge.target).add(edge)
        } else {
          project.inEdgesMap.set(edge.target, new Set([edge]))
        }

        if (edge.source in project.outEdgesMap) {
          project.outEdgesMap.get(edge.source).add(edge)
        } else {
          project.outEdgesMap.set(edge.source, new Set([edge]))
        }
      }
    }
    )

    graph.value?.addData(itemType, models)
  }

  const removeData = (itemType: 'node' | 'edge', id: ID | ID[]) => {
    const project = currentProject.value
    if (!project) return
    (Array.isArray(id) ? id : [id]).forEach(item => {
      if (itemType === 'node') {
        project.nodesMap.delete(item)
        project.inEdgesMap.get(item)?.forEach(edge => project.edgesMap.delete(edge.id))
        project.inEdgesMap.delete(item)
        project.outEdgesMap.get(item)?.forEach(edge => project.edgesMap.delete(edge.id))
        project.outEdgesMap.delete(item)
      }
      if (itemType === 'edge') {
        const edge = project.edgesMap.get(item)
        const source = edge.source
        const target = edge.target
        project.edgesMap.delete(item)
        project.inEdgesMap.get(target)?.delete(edge)
        project.outEdgesMap.get(source)?.delete(edge)
      }
    })
    graph.value?.removeData(itemType, id)
  }

  const getNeighbors = (id: ID) => {
    return [...new Set([...getSuccessors(id), ...getPredecessors(id)])]
  }

  const getSuccessors = (id: ID) => {
    const { outEdgesMap, nodesMap } = currentProject.value;
    return [...outEdgesMap.get(id) ?? []].map(edge => nodesMap.get(edge.target))
  }

  const getPredecessors = (id: ID) => {
    const { inEdgesMap, nodesMap } = currentProject.value;
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


  // const dailyUpdate = () => {
  //   Object.values(projects).forEach((project) => {
  //     const dataCore = new DataCore(project)
  //     const currentX = dateToX(currentTime.value, project.createTime)
  //
  //     const sortedIndexes = [...dataCore.indexMap.keys()].sort((a, b) => a - b)
  //     console.log('sortedIndexes', sortedIndexes)
  //     // todo
  //   })
  // }
  //
  // const forward = (nodeId: ID) => {
  //   const project = currentProject.value
  //   const coreData = new DataCore(project)
  //   const step = (nodeId: ID) => {
  //     const current = coreData.getNode(nodeId)
  //     if (!current) return
  //     coreData.getSuccessorsData(nodeId)
  //       .filter(successor => successor.data.x - current.data.x === UNIT)
  //       .forEach(successor => {
  //           step(successor.id)
  //         }
  //       )
  //     current.data.x += UNIT
  //     // todo
  //   }
  //   step(nodeId)
  // }

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
    getNeighbors
    // dailyUpdate,
    // forward
  }
}
)

