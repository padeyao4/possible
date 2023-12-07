import {useRoute} from "vue-router";
import {useStore} from "@renderer/store/project";

export function useProject() {
  const route = useRoute()
  const store = useStore()
  return store.projects.get(route.params.id as string)
}
