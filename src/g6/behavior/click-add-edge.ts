import type {IG6GraphEvent, Item} from "@antv/g6-core";
import type {BehaviorOption, Graph} from "@antv/g6";
import {useGlobalStore} from "@/store/global";

export default {
    // 设定该自定义行为需要监听的事件及其响应函数
    getEvents() {
        return {
            'node:click': 'onClick', // 监听事件 node:click，响应函数是 onClick
            mousemove: 'onMousemove', // 监听事件 mousemove，响应函数是 onMousemove
            'edge:click': 'onEdgeClick', // 监听事件 edge:click，响应函数是 onEdgeClick, 点击空白处取消边
        };
    },
    // getEvents 中定义的 'node:click' 的响应函数
    onClick(this: BehaviorOption, ev: IG6GraphEvent) {
        const node = ev.item;
        const graph = this.graph as Graph;
        // 鼠标当前点击的节点的位置
        const point = {x: ev.x, y: ev.y};
        const model = node?.getModel()!;
        let edge = this.edge as Item
        if (this.addingEdge && this.edge) {
            graph.updateItem(this.edge as string | Item, {
                target: model.id,
            });
            this.edge = null;
            this.addingEdge = false;

            console.log('model', edge.getModel())
            let edgeModel = edge.getModel()
            const store = useGlobalStore()
            let ids = [edgeModel.source, edgeModel.target]
            let arr = store.currentProjectTasks.filter(task => ids.includes(task.id))
            if (arr.length == 2) {
                let source = arr[0]
                let target = arr [1]
                if (source.dataIndex > target.dataIndex) {
                    let swap = source
                    source = target
                    target = swap
                }
                source.children.push(target.id)
                if (target.parents === undefined) {
                    target.parents = []
                }
                target.parents.push(source.id)
            }
        } else {
            // 在图上新增一条边，结束点是鼠标当前点击的节点的位置
            this.edge = graph.addItem('edge', {
                source: model.id,
                target: point,
            });
            this.addingEdge = true;
        }
    },
    // getEvents 中定义的 mousemove 的响应函数
    onMousemove(this: BehaviorOption, ev: IG6GraphEvent) {
        let self = this
        let graph = self.graph as Graph
        // 鼠标的当前位置
        const point = {x: ev.x, y: ev.y};
        if (this.addingEdge && this.edge) {
            // 更新边的结束点位置为当前鼠标位置
            graph.updateItem(this.edge as string | Item, {
                target: point,
            });
        }
    },
    // getEvents 中定义的 'edge:click' 的响应函数
    onEdgeClick(this: BehaviorOption, ev: IG6GraphEvent) {
        const currentEdge = ev.item;
        // 拖拽过程中，点击会点击到新增的边上
        if (this.addingEdge && this.edge == currentEdge) {
            (this.graph as Graph).removeItem(this.edge as string | Item);
            this.edge = null;
            this.addingEdge = false;
        }
    },
}