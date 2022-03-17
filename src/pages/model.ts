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
    width: number
    height: number
    projects: Project[]
}