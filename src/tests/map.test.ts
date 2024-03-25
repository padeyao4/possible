import { v4 } from 'uuid'
import { test } from 'vitest'

class Node {
    id: string
    name: string

    constructor(name: string) {
        this.id = v4()
        this.name = name
    }
}

class Edge {
    id: string
    source: string
    target: string
}

const nodesMap = new Map<string, Node>()
const edgesMap = new Map<string, Edge>()
const inMap = new Map<string, Set<Edge>>()
const outMap = new Map<string, Set<Edge>>()

const addNode = (node: Node) => {
    nodesMap.set(node.id, node)
    inMap.set(node.id, new Set())
    outMap.set(node.id, new Set())
}

const addEdge = (edge: Edge) => {
    edgesMap.set(edge.id, edge)
    inMap.get(edge.target)?.add(edge)
    outMap.get(edge.source)?.add(edge)
}

const deleteNode = (node: Node) => {
    outMap.get(node.id)?.forEach((edge) => {
        inMap.get(edge.target)?.delete(edge)
    })
    inMap.get(node.id)?.forEach((edge) => {
        outMap.get(edge.source)?.delete(edge)
    })
    nodesMap.delete(node.id)
    inMap.delete(node.id)
    outMap.delete(node.id)
}


test('map tes', () => {
    // a-> b -> c
    const a = new Node("A");
    const b = new Node("B");
    const c = new Node("C");

    addNode(a)
    addNode(b)
    addEdge({ id: v4(), source: a.id, target: b.id })

    addNode(c)
    addEdge({ id: v4(), source: b.id, target: c.id })

})