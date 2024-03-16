declare module 'uuid';
declare module '@icon-park/vue-next';
declare module 'default-passive-events'

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<NonNullable<unknown>, NonNullable<unknown>, never>
  export default component
}