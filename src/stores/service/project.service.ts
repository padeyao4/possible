import { type Edge, type Node, type Project, useProjects, type ID } from '@/stores/projects'
import { v4 } from 'uuid'
import { faker } from '@faker-js/faker'
import { useSettings } from '@/stores/settings'
import { isCross } from '@/lib/math'

export function createProjectTemplate(): Project {
  const { projectMap } = useProjects()
  return {
    id: v4(),
    name: faker.person.fullName(),
    nodeMap: new Map<ID, Node>(),
    edgeMap: new Map<ID, Edge>(),
    inMap: new Map<ID, Set<Edge>>(),
    outMap: new Map<ID, Set<Edge>>(),
    completed: false,
    sortIndex: Array.from(projectMap.values()).length + 1,
    editable: false,
    createTime: faker.date.between({ from: '1900/1/1', to: new Date() }).valueOf(),
    offset: { x: 0, y: 0 }
  }
}

export function createNodeTemplate(): Node {
  return {
    id: v4(),
    name: faker.lorem.words({ min: 5, max: 20 }),
    x: faker.number.int({ min: 0, max: 10 }),
    y: faker.number.int({ min: 0, max: 5 }),
    height: faker.number.int({ min: 1, max: 3 }),
    width: faker.number.int({ min: 1, max: 5 }),
    detail: faker.lorem.paragraphs(2),
    record: faker.lorem.paragraphs(3),
    completed: false,
    sortedIndex: -1,
    projectId: -1
  }
}

export function currentProject(): Project {
  const settings = useSettings()
  const { projectMap } = useProjects()
  return projectMap.get(settings.active) ?? createProjectTemplate()
}

export function testProjects() {
  const projects = useProjects()
  for (let i = 0; i < 10; i++) {
    const project = createProjectTemplate()
    const node1 = createNodeTemplate()
    const node2 = createNodeTemplate()
    if (!isCross(node1, node2) && node1.x + node1.width < node2.x) {
      projects.addNode(project, node1)
      projects.addNode(project, node2)
      projects.addProject(project)
      projects.addEdge(project, node1, node2)
    }
  }
}