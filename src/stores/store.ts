import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { dayjs } from 'element-plus'
import type { ID } from '@antv/g6'
import { dateToX } from '@/utils/time'
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
  nodes: Node[],
  edges: Edge[],
  completed: boolean,
  sortIndex: number,
  editable: boolean,
  createTime: number
}

/**
 *
 */
const UNIT = 120

class DataCore {
  project: Project
  nodesMap: Map<ID, Node>
  edgesMap: Map<ID, Edge>
  sourceMap: Map<ID, ID[]>
  targetMap: Map<ID, ID[]>
  indexMap: Map<number, ID[]>

  constructor(project: Project) {
    this.project = project
    this.nodesMap = new Map(project.nodes.map((node) => [node.id, node]))
    this.edgesMap = new Map(project.edges.map((edge) => [edge.id, edge]))
    this.sourceMap = new Map<ID, ID[]>()
    this.targetMap = new Map<ID, ID[]>()
    this.indexMap = new Map<number, ID[]>()

    this.project.edges.forEach((edge) => {
      const source = edge.source
      const target = edge.target

      if (this.sourceMap && source in this.sourceMap) {
        this.sourceMap.get(source)?.push(target)
      } else {
        this.sourceMap.set(source, [target])
      }

      if (this.targetMap && target in this.targetMap) {
        this.targetMap.get(target)?.push(source)
      } else {
        this.targetMap.set(target, [source])
      }
    })

    this.project.nodes.forEach(node => {
      const x = node.data.x
      if (this.indexMap && x in this.indexMap) {
        this.indexMap.get(x)?.push(node.id)
      } else {
        this.indexMap.set(x, [node.id])
      }
    })
  }

  public getPredecessors(nodeId: ID): ID[] {
    return this.targetMap.get(nodeId) ?? []
  }

  /**
   * Recursively gets all predecessor node IDs for the given node ID.
   *
   * @param nodeId - The ID of the node to get predecessors for
   * @returns An array of all predecessor node IDs
   */
  public getAllPredecessors(nodeId: ID): ID[] {
    const ans: ID[] = []
    this.getPredecessors(nodeId).forEach((predecessor) => {
      ans.push(...this.getAllPredecessors(predecessor))
    })
    return [...new Set(ans), nodeId]
  }

  public getSuccessors(nodeId: ID): ID[] {
    return this.sourceMap.get(nodeId) ?? []
  }

  public getSuccessorsData(nodeId: ID): Node[] {
    return this.getNodes(this.getSuccessors(nodeId))
  }

  public getNode(nodeId: ID): Node | undefined {
    return this.nodesMap.get(nodeId)
  }

  /**
   * Recursively gets all successor nodes for the given node ID.
   *
   * It first gets the immediate successors via `getSuccessors`,
   * then recursively gets the successors of those nodes,
   * and returns a flattened unique array of all successor node IDs.
   */
  public getAllSuccessors(nodeId: ID): ID[] {
    const ans: ID[] = []
    this.getSuccessors(nodeId).forEach((successor) => {
      ans.push(...this.getAllPredecessors(successor))
    })
    return [...new Set(ans), nodeId]
  }

  public getNodes(ids: ID[]) {
    return ids.map((id) => this.nodesMap.get(id))
      .filter((node) => node !== undefined) as Node[]
  }
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

    const nodesMap = new Map<ID, Node>()
    const edgesMap = new Map<ID, Edge>()
    const inEdgesMap = new Map<ID, Set<Edge>>()
    const outEdgesMap = new Map<ID, Set<Edge>>()
    const bothEdgesMap = new Map<ID, Set<Edge>>()

    const projects = ref<Record<string, Project>>({})

    const selected = ref<string>('today')

    const currentTime = ref(new Date())

    const graph = shallowRef<CustomGraph>()

    const selectedNode = ref<Node>()

    const actionState = ref<'none' | 'dragend' | 'edit' | 'contextmenu'>('none')

    const mousePosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })

    const currentProject = computed<Project>(() => {
      const { id } = useRoute().params
      return projects.value[id as string]
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
          Object.assign(nodesMap.get(id).data, item.data)
        }
        if (itemType === 'edge') {
          const newEdge = <Edge>item
          const id = newEdge.id

          const oldEdge = edgesMap.get(id)
          const oldSource = oldEdge.source
          const oldTarget = oldEdge.target

          // 修改edgesMap值
          Object.assign(oldEdge, newEdge)

          const newSource = oldEdge.source
          const newTarget = oldEdge.target

          if (oldSource !== newSource) {
            outEdgesMap.get(oldSource)?.delete(oldEdge)
            if (newSource in outEdgesMap) {
              outEdgesMap.get(newSource)?.add(oldEdge)
            } else {
              outEdgesMap.set(newSource, new Set([oldEdge]))
            }
          }

          if (oldTarget !== newTarget) {
            inEdgesMap.get(oldTarget)?.delete(oldEdge)
            if (newTarget in inEdgesMap) {
              inEdgesMap.get(newTarget)?.add(oldEdge)
            } else {
              inEdgesMap.set(newTarget, new Set([oldEdge]))
            }
          }

          bothEdgesMap.get(oldSource)?.delete(oldEdge)
          bothEdgesMap.get(oldTarget)?.delete(oldEdge)

          if (newSource in bothEdgesMap) {
            bothEdgesMap.get(newSource).add(oldEdge)
          } else {
            bothEdgesMap.set(newSource, new Set([oldEdge]))
          }

          if (newTarget in bothEdgesMap) {
            bothEdgesMap.get(newTarget).add(oldEdge)
          } else {
            bothEdgesMap.set(newTarget, new Set([oldEdge]))
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
            nodesMap.set(id, item)
            project.nodes.push(item)
          }
          if (itemType === 'edge') {
            const edge = <Edge>item
            edgesMap.set(id, edge)
            project.edges.push(edge)

            if (edge.target in inEdgesMap) {
              inEdgesMap.get(edge.target).add(edge)
            } else {
              inEdgesMap.set(edge.target, new Set([edge]))
            }

            if (edge.source in outEdgesMap) {
              outEdgesMap.get(edge.source).add(edge)
            } else {
              outEdgesMap.set(edge.source, new Set([edge]))
            }

            if (edge.source in bothEdgesMap) {
              bothEdgesMap.get(edge.source).add(edge)
            } else {
              bothEdgesMap.set(edge.source, new Set([edge]))
            }

            if (edge.target in bothEdgesMap) {
              bothEdgesMap.get(edge.target).add(edge)
            } else {
              bothEdgesMap.set(edge.target, new Set([edge]))
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
          nodesMap.delete(item)
          inEdgesMap.delete(item)
          outEdgesMap.delete(item)
          bothEdgesMap.delete(item)
          // todo 将project nodes 改成map形式
          project.nodes = project.nodes.filter(node => node.id !== item)
          project.edges = project.edges.filter(edge => edge.source !== item && edge.target !== item)
        }
        if (itemType === 'edge') {
          const edge = edgesMap.get(item)
          const source = edge.source
          const target = edge.target
          edgesMap.delete(item)
          inEdgesMap.get(target)?.delete(edge)
          outEdgesMap.get(source)?.delete(edge)
          bothEdgesMap.get(source)?.delete(edge)
          bothEdgesMap.get(target)?.delete(edge)
          project.edges = project.edges.filter(edge => edge.id !== item)
        }
      })
      graph.value?.removeData(itemType, id)
    }

    const updateGraph = (customGraph: CustomGraph) => {
      graph.value = customGraph
      graph.value?.clear()
      setTimeout(() => {
        graph.value?.read({
          nodes: currentProject.value.nodes,
          edges: currentProject.value.edges
        }).then(() => {
        })
      })
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
      projects.value[project.id] = project
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


    const dailyUpdate = () => {
      Object.values(projects.value).forEach((project) => {
        const dataCore = new DataCore(project)
        const currentX = dateToX(currentTime.value, project.createTime)

        const sortedIndexes = [...dataCore.indexMap.keys()].sort((a, b) => a - b)
        console.log('sortedIndexes', sortedIndexes)
        // todo
      })
    }

    const forward = (nodeId: ID) => {
      const project = currentProject.value
      const coreData = new DataCore(project)
      const step = (nodeId: ID) => {
        const current = coreData.getNode(nodeId)
        if (!current) return
        coreData.getSuccessorsData(nodeId)
          .filter(successor => successor.data.x - current.data.x === UNIT)
          .forEach(successor => {
              step(successor.id)
            }
          )
        current.data.x += UNIT
        // todo
      }
      step(nodeId)
    }

    const save = () => {
      return JSON.stringify(projects.value)
    }

    const restore = (s: string, date: string) => {
      projects.value = JSON.parse(s)
      currentTime.value = new Date(date)
    }

    return {
      projects,
      currentProject,
      currentTime,
      selectedNode,
      actionState,
      mousePosition,
      contextmenuPosition,
      addData,
      updateData,
      removeData,
      updateGraph,
      isActive,
      setSelected,
      addProject,
      addDays,
      updateTime,
      dailyUpdate,
      save,
      restore,
      forward
    }
  }
)

