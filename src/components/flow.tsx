import { Graph } from "@antv/x6";
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

        // const dagreLayout = new DagreLayout({
        //     type: 'dagre',
        //     rankdir: 'LR',
        //     align: 'UL',
        //     ranksep: 0,
        //     nodesep: 0,
        //     controlPoints: false,
        // })
        
        // const model = dagreLayout.layout(data)

        graph = new Graph({
            container: ref.current!,
            autoResize: true,
            panning: true,
            mousewheel: true,
            grid: {
                size: 50,
                visible: true,
                type: 'mesh'
            },
            connecting: {
                allowMulti: false,
                anchor: 'midSide',
            },
            interacting: {
                edgeMovable: false,
                // nodeMovable: false
            },
            background: {
                color: "#F2F7FA",

            },
        })
        graph.fromJSON(data)
        graph.getNodes().forEach(node => {
            node.attr("rect/fill", "#ccc")
            node.resize(50, 50)
            console.log(node)
        })
        graph.drawGrid({

        })
    }, [])

    return (
        <div ref={ref}>
        </div>
    );
}