import { UNIT_H, UNIT_W } from '@/configs/constant'
import type { CustomGraph } from '@/g6/core/graph'
import { dateToX } from '@/utils/time'
import type { ID } from '@antv/g6'
import { dayjs } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, ref, type ShallowRef, shallowRef } from 'vue'

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
  // graph: ShallowRef<CustomGraph>
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

    const graph = shallowRef<CustomGraph>()

    const selectedNode = ref<Node>()

    const actionState = ref<'none' | 'dragend' | 'edit' | 'contextmenu'>('none')

    const mousePosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })

    const contextmenuPosition = computed(() => {
      return graph.value?.getClientByCanvas(mousePosition.value)
    })

    /**
     * 更新节点坐标
     */
    const updateNodePosition = (model: Partial<Node>, project: Project, drawable = true) => {
      const { colsMap, rowsMap, coordinateMap, nodesMap } = project

      const oldNode = nodesMap.get(model.id)

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

      oldNode.data.x = model.data.x
      oldNode.data.y = model.data.y

      if (drawable) {
        graph.value?.updateNodePosition(model)
      }
    }

    const updateNode = (model: Node, project: Project, drawable = true) => {
      const oldNode = project.nodesMap.get(model.id)

      const { colsMap, rowsMap, coordinateMap } = project

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

      if (drawable) {
        graph.value?.updateData('node', model)
      }
    }

    const addEdge = (model: Edge, project: Project) => {
      const { edgesMap, inEdgesMap, outEdgesMap } = project
      edgesMap.set(model.id, model)
      inEdgesMap.get(model.target)?.add(model)
      outEdgesMap.get(model.source)?.add(model)
      graph.value?.addData('edge', model)
    }

    const addNode = (model: Node, project: Project) => {
      const { nodesMap, inEdgesMap, outEdgesMap, rowsMap, colsMap, coordinateMap } = project
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

    const removeNode = (nodeId: ID, project: Project) => {

      const { outEdgesMap, inEdgesMap, nodesMap, edgesMap, rowsMap, colsMap, coordinateMap } = project

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
      const allNodeIds: ID[] = []
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
      const { inEdgesMap, nodesMap } = project
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

    const checkNodeOverlap = (node: Partial<Node>, project: Project) => {
      return project.coordinateMap.has(`${node.data.x},${node.data.y}`)
    }

    const checkSameRelation = (id0: ID, id1: ID, project: Project) => {
      const s = new Set((getRelationNodes(id1, project)))
      return (getRelationNodes(id0, project)).some(node => s.has(node))
    }

    /**
     * 当前节点的所有关联节点都向下移动,向下移动碰到重叠节点。递归重叠节点向下移动
     */
    const moveDown = (model: Node, project: Project, drawable = true) => {
      const allNodes = getRelationNodes(model.id, project).map((nodeId) => project.nodesMap.get(nodeId))
      const s = new Set(allNodes)

      let count = 1
      while (
        allNodes.some((node) => {
          const downNode = project.coordinateMap.get(`${node.data.x},${node.data.y + count * UNIT_H}`)
          return downNode && !s.has(downNode)
        })
        ) {
        count++
      }

      allNodes.forEach(node => {
        updateNodePosition({
          id: node.id,
          data: { x: node.data.x, y: node.data.y + count * UNIT_H }
        }, project, drawable)
      })
    }

    const moveUp = (model: Node, project: Project, drawable = true) => {
      const allNodes = getRelationNodes(model.id, project).map((nodeId) =>
        project.nodesMap.get(nodeId)
      )
      const s = new Set(allNodes)

      let count = 1
      while (
        allNodes.some((node) => {
          const upNode = project.coordinateMap.get(`${node.data.x},${node.data.y - count * UNIT_H}`)
          return upNode && !s.has(upNode)
        })
        ) {
        count++
      }

      allNodes.forEach((node) => {
        updateNodePosition(
          {
            id: node.id,
            data: { x: node.data.x, y: node.data.y - count * UNIT_H }
          },
          project,
          drawable
        )
      })
    }

    /**
     * 找到下方节点
     * @param nodeId
     * @param project
     */
    const findDownNode = (nodeId: ID, project: Project) => {
      const node = project.nodesMap.get(nodeId)
      return project.coordinateMap.get(`${node.data.x},${node.data.y + UNIT_H}`)
    }

    const findRightNode = (nodeId: ID, project: Project) => {
      const node = project.nodesMap.get(nodeId)
      return project.coordinateMap.get(`${node.data.x + UNIT_W},${node.data.y}`)
    }

    const findLeftNode = (nodeId: ID, project: Project) => {
      const node = project.nodesMap.get(nodeId)
      return project.coordinateMap.get(`${node.data.x - UNIT_W},${node.data.y}`)
    }

    /**
     * Recursively finds all nodes below the given nodeId by traversing downwards.
     * Returns nodes from bottom to top.
     */
    const findAllDownNode = (nodeId: ID, project: Project) => {
      const node = project.nodesMap.get(nodeId)
      const downNode = findDownNode(nodeId, project)
      if (downNode) {
        return [...findAllDownNode(downNode.id, project), ...[node]]
      } else {
        return [node]
      }
    }

    /**
     * 向右移动,如果有重叠节点,重叠节点和重叠节点的关联节点都向下移动
     */
    const moveRight = (nodeId: ID, project: Project, drawable = true) => {
      const node = project.nodesMap.get(nodeId)
      getSuccessors(node.id, project)
        .filter(successor => {
          return successor.data.x - node.data.x === UNIT_W
        })
        .forEach(successor => {
          moveRight(successor.id, project, drawable)
        })

      let currentRightNode = findRightNode(nodeId, project)
      while (currentRightNode) {
        moveDown(currentRightNode, project, drawable)
        currentRightNode = findRightNode(nodeId, project)
      }

      updateNodePosition(
        { id: node.id, data: { x: node.data.x + UNIT_W, y: node.data.y } },
        project,
        drawable
      )
    }

    const moveLeft = (nodeId: ID, project: Project, currentX: number, drawable = true) => {
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
        let currentLeftNode = findLeftNode(nodeId, project)
        while (currentLeftNode) {
          moveDown(currentLeftNode, project, drawable)
          currentLeftNode = findLeftNode(nodeId, project)
        }
        updateNodePosition({ id: node.id, data: { x: node.data.x - UNIT_W, y: node.data.y } }, project, drawable)
        return true
      }
    }

    const dailyUpdate = () => {
      console.log('start daily update')
      Object.values(projects.value).forEach((project) => {
        const currentX = dateToX(currentTime.value, project.createTime)
        let nodes = [...project.nodesMap.values()]
          .filter((node) => node.data.x < currentX && !node.data.completed)
          .sort((a, b) => a.data.x - b.data.x)
        while (nodes.length > 0) {
          // todo 判断是否渲染
          moveRight(nodes[0].id, project)
          nodes = [...project.nodesMap.values()]
            .filter((node) => node.data.x < currentX && !node.data.completed)
            .sort((a, b) => a.data.x - b.data.x)
        }
      })
      console.log('daily update done')
    }

    return {
      projects,
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
      moveDown,
      moveUp,
      dailyUpdate,
      checkNodeOverlap,
      bfsOutEdge,
      bfsInEdge,
      bfsAllNodes,
      getRelationNodes,
      findDownNode,
      findAllDownNode,
      findRightNode,
      checkSameRelation
    }
  }
)

