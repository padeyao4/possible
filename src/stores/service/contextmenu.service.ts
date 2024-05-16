import { useCanvasContextMenu } from "../contextmenu-store"
import { useProjects } from "../projects"
import { currentProject } from "./project.service"

/**
 * Shows the right-click context menu for a node in the canvas.
 * This function is called when the user right-clicks on a node in the canvas.
 * It retrieves the current project, the node ID of the clicked node, and then
 * traverses the outgoing edges of the node to perform some action (currently empty).
 */
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