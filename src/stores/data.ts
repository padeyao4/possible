import { defineStore } from 'pinia';

type ID = string | number;

interface Project {
  id: ID;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  offset: {
    x: number;
    y: number;
  };
}

interface Node {
  id: ID;
  projectId: ID;
  name: string;
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
  status: boolean; // true 表示完成
}

interface Edge {
  id: ID;
  projectId: ID;
  source: number;
  target: number;
}

export const useModel = defineStore('data', {
  state: () => ({
    projects: <Project[]>[]
  }),
  getters: {
    getProjectById: (state) => (id: ID) => {
      return state.projects.find((project) => project.id === id);
    },
    getNodeById: (state) => (projectId: ID, nodeID: ID) => {
      return state.projects
        .find((project) => project.id === projectId)
        ?.nodes.find((node) => node.id === nodeID);
    },
    getNodesByX: (state) => (x: number) => {
      return state.projects.flatMap((project) => {
        return project.nodes.filter((node) => node.x === x);
      });
    }
  },
  actions: {
    addProject(project: Project) {
      this.projects.push(project);
    },
    removeProject(project: Project) {
      // todo
    },
    updateProject(project: Project) {
      // todo
    },
    addNode(node: Node) {
      // todo
    },
    removeNode(node: Node) {
      // todo
    },
    updateNode(node: Node) {
      // todo
    }
  }
});

class DataController {
  projectsMap: Map<ID, Project>;
  nodesMap: Map<ID, Node>;
  edgesMap: Map<ID, Edge>;
  inEdgesMap: Map<ID, Set<Edge>>; // Map中的ID表示edge中的target,Set中的Edge表示所有指向该节点的边
  outEdgesMap: Map<ID, Set<Edge>>; // Map中的ID表示edge中的source,Set中的Edge表示所有从该节点出发的边
  dataModel: any;

  constructor() {
    this.projectsMap = new Map();
    this.nodesMap = new Map();
    this.edgesMap = new Map();
    this.inEdgesMap = new Map();
    this.outEdgesMap = new Map();
    this.dataModel = useModel();
  }

  getProjectById(projectId: ID) {
    return this.projectsMap.get(projectId);
  }

  addProject(project: Project) {
    this.projectsMap.set(project.id, project);
    this.dataModel.addProject(project);
  }

  removeProjectById(projectId: ID) {
    this.projectsMap.delete(projectId);
    this.dataModel.removeProject(projectId);
  }

  getNodeById(nodeId: ID) {
    return this.nodesMap.get(nodeId);
  }

  getRelationsNodes(node: Node) {
    // todo
  }

  addNode(node: Node) {
    this.nodesMap.set(node.id, node);
    this.dataModel.addNode(node.projectId, node);
  }

  updateNode(node: Node) {
    // todo
  }

  removeNode(node: Node) {
    // todo
  }

  addEdge(edge: Edge) {
    // todo
  }

  removeEdge(edge: Edge) {
    // todo
  }

  updateEdge(edge: Edge) {
    // todo
  }
}

export const dataController = new DataController();

export function newProject(): Project {
  return {
    description: '',
    edges: [],
    id: undefined,
    name: '',
    nodes: [],
    offset: { x: 0, y: 0 }
  };
}
