import type { CustomGraph } from "@/g6/core/graph"
import { useStore } from "@/stores/store"

export function debug(graph: CustomGraph) {
    // const store = useStore()
    // const { nodesMap, edgesMap, inEdgesMap, outEdgesMap } = store.currentProject
    // console.log('')
    // console.log("---------------------store-----------------------")
    // console.log('node', [...nodesMap.values()].map(n => n.data.name))
    // console.log('edge', [...edgesMap.values()].map(n => { return nodesMap.get(n.source)?.data.name + "->" + nodesMap.get(n.target)?.data.name ?? n.target }))
    // console.log('in', [...inEdgesMap.values()].map((s) => {
    //     return [...s].map(
    //         (e) => {
    //             return e.id + ":" + nodesMap.get(e.source)?.data.name + '->' + nodesMap.get(e.target)?.data.name
    //         }
    //     )
    // }).flat())
    // console.log('out', [...outEdgesMap.values()].map((s) => {
    //     return [...s].map(
    //         (e) => {
    //             return e.id + ":" + nodesMap.get(e.source)?.data.name + '->' + nodesMap.get(e.target)?.data.name
    //         }
    //     )
    // }).flat())

    // console.log("--------------------graph------------------------")
    // console.log(graph.getAllNodesData().map(n => n.data.name))
    // console.log(graph.getAllEdgesData().map(n => nodesMap.get(n.source)?.data.name + "->" + nodesMap.get(n.target)?.data.name))
}