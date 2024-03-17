import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { dayjs } from 'element-plus'
import type { ID } from '@antv/g6'
import { dateToX } from '@/utils/time'

export interface Node {
  id: ID,
  data: Record<string, any>
}

export interface Edge {
  id: ID
  source: ID,
  target: ID
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
  const projects = ref<Record<string, Project>>({})

  const selected = ref<string>('today')

  const currentTime = ref(new Date())

  const currentProject = computed<Record<any, any>>(() => {
    const { id } = useRoute().params
    return projects.value[id as string]
  })

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
      const UNIT = 120
      const dataCore = new DataCore(project)
      const currentX = dateToX(currentTime.value, project.createTime)

      const sortedIndexes = [...dataCore.indexMap.keys()].sort((a, b) => a - b)
      console.log('sortedIndexes', sortedIndexes)
    })
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
    isActive,
    setSelected,
    addProject,
    addDays,
    updateTime,
    dailyUpdate,
    save,
    restore
  }
})

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