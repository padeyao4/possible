import { type Edge, type Node, type Project, useState } from '@/stores/state'
import { v4 } from 'uuid'
import type { ID } from '@antv/g6'
import { faker } from '@faker-js/faker'

export function createProjectTemplate(): Project {
  const projectCreateTime = faker.date.between({ from: '1900/1/1', to: '2024/3/20' }).valueOf()
  const { projectMap } = useState()
  return {
    id: v4(),
    name: faker.person.fullName(),
    nodeMap: new Map<ID, Node>(),
    edgeMap: new Map<ID, Edge>(),
    inMap: new Map<ID, Set<Edge>>(),
    outMap: new Map<ID, Set<Edge>>(),
    rowMap: new Map<ID, Set<Node>>(),
    colMap: new Map<ID, Set<Node>>(),
    coordinateMap: new Map<string, Node>(),
    completed: false,
    sortIndex: Array.from(projectMap.values()).length + 1,
    editable: true,
    createTime: projectCreateTime,
    offset: { x: 0, y: 0 }
  }
}

export function addProject(project: Project) {
  const { projectMap } = useState()
  projectMap.set(project.id, project)
}

export function testProjects() {
  for (let i = 0; i < 10; i++) {
    const project = createProjectTemplate()
    addProject(project)
  }
}