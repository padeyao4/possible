import './layout/possibleLayout'
import './node/possibleNode'
import './behavior/possibleNodeDrag'

import {nextTick, onBeforeUnmount, onMounted, Ref, ref} from "vue";
import {Graph, GraphData, IEdge, IGraph, Menu, ModelConfig} from "@antv/g6";
import PossibleGrid from "@renderer/g6/plugin/possibleGrid";
import {PossibleTimeBar} from "@renderer/g6/plugin/possibleTimeBar";
import {IG6GraphEvent, INode, Item} from "@antv/g6-core";
import {deltaIndex} from "@renderer/util/time";
import {useDateStore} from "@renderer/store/date";
import {IPosEdge, IPosNode, IProject} from "@renderer/store";
import {v4 as uuidv4} from "uuid";
import {normalX} from "@renderer/util";
import {debounce} from "@antv/util";

export function useGraph(container: Ref<HTMLElement | undefined>,
                         timeBar: Ref<HTMLElement | undefined>,
                         project: IProject,
                         nodeDblClick: undefined | ((e: IG6GraphEvent, graph: null | IGraph) => void)) {
    const dateStore = useDateStore()

    let graph: null | IGraph;
    const dataIndex = () => {
        return deltaIndex(dateStore.now, project.initDate)
    }

    function addListen(graph: IGraph) {
        graph.on('edge:mouseover', (e) => {
            graph?.setItemState(e.item as Item, 'hover', true)
        })

        graph.on('edge:mouseout', (e) => {
            graph.setItemState(e.item as Item, 'hover', false)
        })

        // open drawer editor
        graph.on('node:dblclick', (e) => {
            nodeDblClick?.(e, graph)
        })

        graph.on('canvas:dblclick', (e) => {
            const newTaskModel: IPosNode = {
                completedTime: undefined,
                createdTime: new Date(),
                id: uuidv4(),
                name: 'untitled',
                x: normalX(e.x),
                y: e.y,
                ix: 0,
                iy: 0,
                state: 'normal',
                detail: '',
                note: '',
                target: '',
                taskType: 'general'
            }
            graph?.addItem('node', newTaskModel as unknown as ModelConfig)
            graph?.layout()
        })

        graph.on('node:dragend', () => {
            graph?.layout()
        })

        graph.on('aftercreateedge', (e) => {
            const edge = e.edge as IEdge

            const sourceNode = edge.getSource() as INode
            const targetNode = edge.getTarget() as INode

            // 删除自环边
            if (sourceNode === targetNode) {
                nextTick(() => {
                    graph?.removeItem(edge)
                }).then(_ => {
                })
                return
            }

            // 删除重复边
            const count = sourceNode
                .getEdges()
                .filter(
                    (e) =>
                        e.getTarget().getID() === targetNode.getID() ||
                        e.getSource().getID() === targetNode.getID()
                ).length
            if (count >= 2) {
                nextTick(() => {
                    graph?.removeItem(edge)
                }).then(undefined)
                return
            }

            // 删除相同列的边
            if ((sourceNode.getModel().x as number) >= (targetNode.getModel().x as number)) {
                nextTick(() => {
                    graph?.removeItem(edge)
                }).then(_ => {
                })
                return
            }
        })

        graph.on('viewportchange', () => {
            const {x, y} = graph?.getCanvasByPoint(0, 0) ?? {x: 0, y: 0}
            project.offset.x = x
            project.offset.y = y
        })

        graph.on('afterremoveitem', debounceSave)
        graph.on('afteradditem', debounceSave)
        graph.on('afterupdateitem', debounceSave)
    }

    const debounceSave = debounce(save, 3000)

    function save() {
        const data = graph?.save() as GraphData | undefined
        if (!data) return
        const {nodes, edges} = data
        const posNodes = nodes?.map(({
                                         name,
                                         id,
                                         ix,
                                         iy,
                                         y,
                                         x,
                                         createdTime,
                                         completedTime,
                                         state,
                                         target,
                                         detail,
                                         note,
                                         taskType,
                                         orderIndex
                                     }) => {
            return {
                name, id, ix, iy, y, x, createdTime, completedTime, state, target, detail, note, taskType, orderIndex
            } as IPosNode
        }) ?? []
        const posEdges = edges?.map(({id, source, target}) => {
            return {id, source, target} as IPosEdge
        }) ?? []
        project.data = {
            nodes: posNodes,
            edges: posEdges
        }
    }

    onMounted(() => {
        graph = new Graph({
            container: 'container',
            animate: true,
            animateCfg: {
                duration: 300
            },
            layout: {
                type: 'possible-layout',
                todayIndex: dataIndex()
            },
            plugins: [
                new PossibleGrid(),
                new PossibleTimeBar(project, timeBar.value as HTMLElement),
                new Menu({
                    offsetX: -(container.value as HTMLElement).offsetLeft,
                    offsetY: -(container.value as HTMLElement).offsetTop,
                    getContent: () => {
                        const menu = document.createElement('div')
                        menu.className = 'graph-menu'
                        menu.innerHTML = `<ul>
                              <li title="delay">延期</li>
                              <li title="move">平移</li>
                              <li title="delete">删除</li>
                            </ul>`
                        return menu
                    },
                    handleMenuClick: (el: HTMLElement, item: Item) => {
                        console.debug(el.title)
                        switch (el.title) {
                            case 'delay': {
                                console.log('delay')
                                break
                            }
                            case 'move': {
                                console.log('move')
                                break
                            }
                            case 'delete': {
                                console.log('delete')
                                graph?.removeItem(item)
                                graph?.layout()
                                break
                            }
                        }
                    }
                })
            ],
            modes: {
                default: [
                    {
                        type: 'drag-canvas',
                        allowDragOnItem: false,
                        enableOptimize: true,
                        scalableRange: 99
                    },
                    {
                        type: 'possible-drag-node',
                        enableOptimize: true
                    },
                    {
                        type: 'create-edge',
                        trigger: 'drag',
                        key: 'shift'
                    }
                ]
            },
            defaultNode: {
                type: 'task-node'
            },
            defaultEdge: {
                type: 'cubic-horizontal'
            },
            edgeStateStyles: {
                hover: {
                    stroke: 'rgba(154,154,154,0.38)',
                    lineWidth: 2
                }
            }
        })
        const {x, y} = project.offset
        graph.data(project.data as unknown as GraphData)
        graph.render()
        graph.translate(x, y)
        addListen(graph)
        dateStore.$subscribe(() => {
            graph?.updateLayout({
                todayIndex: dataIndex()
            })
            graph?.emit('possible-update', {x: project.offset.x})
        })
        window.addEventListener('resize', () => {
            if (container.value) {
                graph?.changeSize(container.value.clientWidth, container.value.clientHeight)
            }
        })
        interval.value = setInterval(debounceSave, 30_000)
    })

    const interval = ref()

    onBeforeUnmount(() => {
        clearInterval(interval.value)
        save()
        graph?.destroy()
        graph = null
    })

    function call(callback: (graph: IGraph | null) => any) {
        return callback?.(graph)
    }

    return {call, save}
}
