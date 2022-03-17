export class Action {
    title: string
    detail: string
    start: number
    end: number
    rowIndex: number
}

export class Project {
    goal: string
    start: number
    end: number
    color: string
    actions: Action[]
}


export class Model {
    current: number
    cursor: number
    /**
     * 界面宽度,默认显示7天
     */
    width: number = 7
    /**
     * 界面任务数量，高度。默认50个任务并行
     */
    height: number = 50
    projects: Project[]
}