export class Plan {
    content: string
    date: number
    rowIndex: number
    /**
     * 用来记录计划完成的情况
     */
    record: string
}

export class Project {
    goal: string
    /**
     * 记录最早的计划,(包含)
     */
    start: number
    /**
     * 记录最晚的计划,(不包含)
     */
    end: number
    color: string
    actions: Plan[]
}


export class Model {
    current: number = new Date().getDate()
    cursor: number = this.current
    /**
     * 界面宽度,默认显示7天
     */
    cols: number = 7
    /**
     * 界面任务数量，高度。默认50个任务并行
     */
    rows: number = 50
    projects: Project[] = []
    /**
     * 项目索引,默认为null
     */
    projectIndex: number | null = null
}