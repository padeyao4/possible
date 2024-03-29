import { type Edge, type Node, type Project, useStore } from '@/stores/store'
import type { ID } from '@antv/g6'
import { onBeforeMount, onUnmounted, ref, shallowReactive } from 'vue'
import { Store } from 'tauri-plugin-store-api'
import log from 'loglevel'

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
function serialize(value: Record<string, Project>): string {
  return JSON.stringify([...Object.values(value)].map((project: Project) => {
    const { id, name, completed, sortIndex, editable, createTime,offset } = project
    return {
      offset,
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
function deserialize(value: string): Project[] {
  return JSON.parse(value).map((project: any) => {
    const { id, name, completed, sortIndex, editable, createTime, nodes, edges,offset } = project

    const nodesMap = new Map<ID, Node>()
    const edgesMap = new Map<ID, Edge>()
    const inEdgesMap = new Map<ID, Set<Edge>>()
    const outEdgesMap = new Map<ID, Set<Edge>>()
    const rowsMap = new Map<ID, Set<Node>>()
    const colsMap = new Map<ID, Set<Node>>()
    const coordinateMap = new Map<string, Node>()
    const data = shallowReactive({ graph: null })

    nodes.forEach((node: Node) => {
      updateMap(node, nodesMap, inEdgesMap, outEdgesMap, rowsMap, colsMap, coordinateMap)
    })

    edges.forEach((edge: Edge) => {
      edgesMap.set(edge.id, edge)
      inEdgesMap.get(edge.target)?.add(edge)
      outEdgesMap.get(edge.source)?.add(edge)
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
      coordinateMap,
      data,
      offset
    }
  })

}

interface StorageLike {
  get: (key: string) => Promise<string>
  set: (key: string, value: any) => Promise<any>
  save: () => Promise<any>
}

class LocalStorageStore implements StorageLike {
  get = (key: string) => {
    return new Promise<string>((resolve) => {
      resolve(localStorage.getItem(key))
    })
  }

  set = (key: string, value: any) => {
    return new Promise<void>((resolve) => {
      localStorage.setItem(key, value)
      resolve()
    })
  }

  save = () => new Promise<void>(() => {
  })
}

export function useLoadData() {
  const timer = ref()
  const store = useStore()

  // windows下 store存储地址在 C:\Users\username\AppData\Roaming\com.github.padeyao4\db.dat
  const db = import.meta.env?.VITE_TAURI === 'true' ? new Store(import.meta.env?.VITE_DATA_PATH??'./test.db') : new LocalStorageStore()


  function scheduleMidnightTask() {
    const now: Date = new Date()
    const midnight: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
    const delay: number = midnight.getTime() - now.getTime()
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      store.updateTime()
      store.dailyUpdate()
      // 设置下一个午夜的定时器
      scheduleMidnightTask()
    }, delay)
  }

  onBeforeMount(() => {
    db.get('data').then((value: string) => {
      if (value) {
        const projects = deserialize(value)
        projects.forEach((project) => {
          store.addProject(project)
        })
      }
    }).then(() => {
      store.updateTime()
      store.dailyUpdate()
      scheduleMidnightTask()
      store.$subscribe(() => {
        const content = serialize(store.projects)
        db.set('data', content).then(() => log.debug('set data'))
        db.save().then(() => log.debug('save data'))
      }, { detached: true })
    })
  })

  onUnmounted(() => {
    clearTimeout(timer.value)
  })

}