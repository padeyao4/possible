import { Graph } from "@antv/x6";
import { useEffect, useRef } from "react";

export default function Flow() {
    const ref = useRef(null)
    let graph: Graph | null = null

    useEffect(() => {
        if (graph != null) return
        console.log('render');

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
    }, [])

    return (
        <div ref={ref}>
        </div>
    );
}