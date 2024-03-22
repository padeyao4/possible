import { type Edge, type Node, type Project } from '@/stores/store'
import type { ID } from '@antv/g6'

/**
 * Updates the node maps and edge maps with a new node model.
 *
 * Checks if the node's x,y coordinate is already used, and if not, adds
 * the node to the various maps tracking nodes, edges, rows, and columns.
 *
 * Returns true if the node was successfully added, false if the coordinate
 * was already used.
 */
function updateMap(
  model: Node,
  nodesMap: Map<ID, Node>,
  inEdgesMap: Map<ID, Set<Edge>>,
  outEdgesMap: Map<ID, Set<Edge>>,
  rowsMap: Map<ID, Set<Node>>,
  colsMap: Map<ID, Set<Node>>,
  coordinateMap: Map<string, Node>
) {
  const { x, y } = model.data
  if (coordinateMap.has(`${x},${y}`)) return false

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
  return true
}

/**
 * Serializes the Pinia store value containing projects data into a JSON string.
 *
 * Loops through the projects Map, converts each Project object into a plain object
 * containing only the fields needed for persistence, and collects them in an array.
 * Also converts the Map values for nodes and edges into arrays.
 *
 * This allows persisting the relevant data from the Pinia store in localStorage while
 * stripping out any reactivity or excess fields that don't need to be persisted.
 */
export function serialize(value: Record<string, Project>): string {
  return JSON.stringify([...Object.values(value)].map((project: Project) => {
    const { id, name, completed, sortIndex, editable, createTime } = project
    return {
      id,
      name,
      completed,
      sortIndex,
      editable,
      createTime,
      nodes: [...project.nodesMap.values()],
      edges: [...project.edgesMap.values()]
    }
  }))
}

/**
 * Deserializes a JSON string containing serialized project data
 * back into a Pinia store value.
 *
 * Loops through the projects array, converting each plain object
 * back into a Project instance with Maps for nodes, edges, etc.
 *
 * Returns a Pinia store value containing the deserialized projects.
 */
export function deserialize(value: string): Project[] {
  return JSON.parse(value).map((project: any) => {
    const { id, name, completed, sortIndex, editable, createTime, nodes, edges } = project

    const nodesMap = new Map<ID, Node>()
    const edgesMap = new Map<ID, Edge>()
    const inEdgesMap = new Map<ID, Set<Edge>>()
    const outEdgesMap = new Map<ID, Set<Edge>>()
    const rowsMap = new Map<ID, Set<Node>>()
    const colsMap = new Map<ID, Set<Node>>()
    const coordinateMap = new Map<string, Node>()

    nodes.forEach((node) => {
      updateMap(node, nodesMap, inEdgesMap, outEdgesMap, rowsMap, colsMap, coordinateMap)
    })

    edges.forEach((edge) => {
      edgesMap.set(edge.id, edge)
    })

    return {
      id,
      name,
      completed,
      sortIndex,
      editable,
      createTime,
      nodesMap,
      edgesMap,
      inEdgesMap,
      outEdgesMap,
      rowsMap,
      colsMap,
      coordinateMap
    }
  })

}