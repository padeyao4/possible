import {IProject} from "@renderer/store";

declare module 'default-passive-events'
declare module '*.vue' {
    import {DefineComponent} from 'vue'
    const component: DefineComponent<NonNullable<unknown>, NonNullable<unknown>, never>
    export default component
}

type PossibleData = {
    projects: IProject[],
    time: number,
    version: string
}
