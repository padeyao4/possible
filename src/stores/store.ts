import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

export const useStore = defineStore('store', () => {
  const projects = ref<any>({})

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

  const sortedProjects = computed(() => {
    return Object.values(projects.value).sort((p1, p2) => (p2 as any).sortIndex - (p1 as any).sortIndex) as any
  })

  const addProject = (project: any) => {
    projects.value[project.id] = project
    return project.id
  }

  return { projects, currentProject, isActive, setSelected, sortedProjects, addProject, currentTime }
})
