import {reactive} from "vue";

export default reactive({
    projects: [{
        name: '1',
        nodes: [{
            name: 'node1',
            id: 'node1',
            dataIndex: 1,
            priority: 0,
            children: [],
            parent: []
        }, {
            name: 'node2',
            id: 'node2',
            dataIndex: 2,
            priority: 0,
            children: [],
            parent: []
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
                parent: []
            })
        }
    },
    dataByIndex(index) {
        let project = this.projects[index];
        let nodes = project.nodes
        console.log("store project", project)
        return {
            nodes: nodes.map((v) => {
                return {
                    id: v.id,
                    label: v.name,
                    x: v.dataIndex * 120 - 60,
                    y: v.priority * 40 + 28
                }
            })
        }
    }
})