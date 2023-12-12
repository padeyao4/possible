import {PProject} from "@renderer/model";

declare module 'default-passive-events'
declare module '*.vue' {
  import {DefineComponent} from 'vue'
  const component: DefineComponent<NonNullable<unknown>, NonNullable<unknown>, never>
  export default component
}

type PossibleData = {
  projects: PProject[],
  time: number,
  version: string
}
