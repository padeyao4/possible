import {reactive} from "vue";

export default reactive({
    projects: [],
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
                dateIndex: 0, // 时间索引
                children: [],
                parent: []
            })
        }
    }
})