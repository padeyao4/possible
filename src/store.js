import {reactive} from "vue";

export default reactive({
    projects: [{
        name: '1',
        nodes: [{
            name: 'node1',
            id: 'node1',
            dataIndex: 1,
            priority: 0,
            children: ['node2','node3'],
        }, {
            name: 'node2',
            id: 'node2',
            dataIndex: 2,
            priority: 3,
            children: ['node3'],
        }, {
            name: 'node3',
            id: 'node3',
            dataIndex: 6,
            priority: 1,
            children: [],
        },
        ]
    }, {
        name: '2',
        nodes: []
    }],
    addProject(name) {
        this.projects.push({
            name,
            nodes: [],
        })
    },
    addTask(projectName, taskName) {
        let result = this.projects.filter((project) => project.name === projectName);
        if (result.length === 1) {
            result[0].nodes.push({
                name: taskName,
                dataIndex: 0, // 时间索引
                children: [],
            })
        }
    },
    dataByIndex(index) {
        let project = this.projects[index];
        let nodes = project.nodes

        let edges = []
        for (let i in nodes) {
            let node = nodes[i]
            let children = node.children
            for (let j in children) {
                let edge = {
                    source: node.id,
                    target: children[j]
                }
                edges.push(edge)
            }
        }

        return {
            nodes: nodes.map((v) => {
                return {
                    id: v.id,
                    label: v.name,
                    x: v.dataIndex * 120 - 60,
                    y: v.priority * 40 + 28
                }
            }),
            edges
        }
    }
})