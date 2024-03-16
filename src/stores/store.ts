import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

interface Project {
  id: string,
  name: string,
  nodes: any[],
  edges: any[],
  completed: boolean,
  sortIndex: number,
  editable: boolean,
  createTime: number
}

export const useStore = defineStore('store', () => {
  const projects = ref<Record<string, Project>>({})

  const selected = ref<any>('today')

  const currentTime = ref(new Date())

  const currentProject = computed<Record<any, any>>(() => {
    const { id } = useRoute().params
    return projects.value[id as string]
  })

  const setSelected = (value: string) => {
    selected.value = value
  }

  const isActive = (value: string) => {
    return selected.value === value
  }

  const addProject = (project: Project) => {
    projects.value[project.id] = project
    return project.id
  }

  return { projects, currentProject, isActive, setSelected, addProject, currentTime }
})
