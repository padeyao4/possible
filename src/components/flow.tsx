import { Graph } from "@antv/G6";
import { useEffect, useRef } from "react";

const data = {
    // 点集
    nodes: [
        {
            id: 'a', // String，该节点存在则必须，节点的唯一标识
            label: 'a',
            layer: 1,
        },
        {
            id: 'b', // String，该节点存在则必须，节点的唯一标识
            label: 'b',
            layer: 2
        },
        {
            id: 'c', // String，该节点存在则必须，节点的唯一标识
            label: 'c',
            layer: 3
        },
        {
            id: 'd', // String，该节点存在则必须，节点的唯一标识
            label: 'd',
            layer: 4
        },
    ],
    // 边集
    edges: [
        {
            source: 'a',
            target: 'b', // String，必须，目标点 id
        },
        {
            source: 'a', // String，必须，起始点 id
            target: 'c', // String，必须，目标点 id
        },
        {
            source: 'b', // String，必须，起始点 id
            target: 'd', // String，必须，目标点 id
        },
        {
            source: 'c', // String，必须，起始点 id
            target: 'd', // String，必须，目标点 id
        },
    ],
};

export default function Flow() {
    const ref = useRef(null)
    let graph: Graph | null = null

    useEffect(() => {
        if (graph != null) return

        graph = new Graph({
            container: ref.current!,
            width: 1000,
            height: 800
        })

        graph.data(data)
        graph.render()
    }, [])

    return (
        <div ref={ref}>
        </div>
    );
}