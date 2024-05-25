import { useCanvasContextMenu } from "@/stores/contextmenu"
import { useProjects } from "@/stores/projects"
import { appendNode, currentProject, moveDown, moveLeft, moveRight, tryMoveDownWhole, tryMoveUp, tryMoveUpWhole } from "@/service/project.service"

export function showRightCards() {
    const projects = useProjects()
    const contextmenu = useCanvasContextMenu()
    const target = contextmenu.mouseEvent.target as Element
    const nodeId = target.getAttribute('data-key')
    const project = currentProject()
    projects.bfsTraverseOutEdge(project, nodeId, (node) => {
        console.log('Node:', node.name)
    })
}

export function showLefCards() {
    const projects = useProjects()
    const contextmenu = useCanvasContextMenu()
    const target = contextmenu.mouseEvent.target as Element
    const nodeId = target.getAttribute('data-key')
    const project = currentProject()
    projects.bfsTraverseInEdge(project, nodeId, (node) => {
        console.log('Node:', node.name)
    })
}

export function showAllCards() {
    const projects = useProjects()
    const contextmenu = useCanvasContextMenu()
    const target = contextmenu.mouseEvent.target as Element
    const nodeId = target.getAttribute('data-key')
    const project = currentProject()
    projects.bfsTraverseNode(project, nodeId, (node) => {
        console.log('Node:', node.name)
    })
}

export function tryMoveDownNode() {
    const contextmenu = useCanvasContextMenu()
    const target = contextmenu.mouseEvent.target as Element
    const nodeId = target.getAttribute('data-key')
    const project = currentProject()
    moveDown(project, project.nodeMap.get(nodeId))
}

export function tryMoveUpNode() {
    const contextmenu = useCanvasContextMenu()
    const target = contextmenu.mouseEvent.target as Element
    const nodeId = target.getAttribute('data-key')
    const project = currentProject()
    tryMoveUp(project, project.nodeMap.get(nodeId))
}

export function tryMoveRgitNode() {
    const contextmenu = useCanvasContextMenu()
    const target = contextmenu.mouseEvent.target as Element
    const nodeId = target.getAttribute('data-key')
    const project = currentProject()
    moveRight(project, project.nodeMap.get(nodeId))
}

export function tryMoveLeftNode() {
    const contextmenu = useCanvasContextMenu()
    const target = contextmenu.mouseEvent.target as Element
    const nodeId = target.getAttribute('data-key')
    const project = currentProject()
    moveLeft(project, project.nodeMap.get(nodeId))
}

export function handleCompletedTask() {
    const contextmenu = useCanvasContextMenu()
    const target = contextmenu.mouseEvent.target as Element
    const nodeId = target.getAttribute('data-key')
    const project = currentProject()
    const node = project.nodeMap.get(nodeId)
    node.completed = !node.completed
}

export function handleDeleteTask() {
    const contextmenu = useCanvasContextMenu()
    const project = currentProject()
    const el = contextmenu.mouseEvent.target as Element
    const key = el.getAttribute('data-key')
    useProjects().removeNode(project, key)
}

export function handleMoveUpWhole() {
    const contextmenu = useCanvasContextMenu()
    const project = currentProject()
    const el = contextmenu.mouseEvent.target as Element
    const key = el.getAttribute('data-key')
    const node = project.nodeMap.get(key)
    tryMoveUpWhole(project, node)
}

export function handleMoveDownWhole() {
    const contextmenu = useCanvasContextMenu()
    const project = currentProject()
    const el = contextmenu.mouseEvent.target as Element
    const key = el.getAttribute('data-key')
    const node = project.nodeMap.get(key)
    tryMoveDownWhole(project, node)
}

export function handleAppendNode() {
    const contextmenu = useCanvasContextMenu()
    const project = currentProject()
    const el = contextmenu.mouseEvent.target as Element
    const key = el.getAttribute('data-key')
    const node = project.nodeMap.get(key)
    appendNode(project, node)
}