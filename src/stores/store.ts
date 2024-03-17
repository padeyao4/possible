import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { dayjs } from 'element-plus'
import type { ID } from '@antv/g6'

export interface Node {
    id: ID,
    data: Record<string, any>
}

export interface Edge {
    id: ID
    source: ID,
    target: ID
}

export interface Project {
    id: string,
    name: string,
    nodes: Node[],
    edges: Edge[],
    completed: boolean,
    sortIndex: number,
    editable: boolean,
    createTime: number
}

/**
 * Defines a Pinia store that manages project state.
 *
 * Includes computed values, refs, and methods for:
 * - Getting the current project based on route params
 * - Tracking the selected tab
 * - Getting the current date/time
 * - Adding new projects
 * - Incrementing the current date/time
 */
export const useStore = defineStore('store', () => {
  const projects = ref<Record<string, Project>>({})

  const selected = ref<string>('today')

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

  /**
   * Adds a new project to the projects map/object.
   * @param project - The project object to add.
   * @returns The id of the added project.
   */
  const addProject = (project: Project) => {
    projects.value[project.id] = project
    return project.id
  }

  /**
 * Adds the specified number of days to the current date/time.
 *
 * @param days - The number of days to add.
 * @returns The updated date/time after adding the days.
 */
  const addDays = (days: number) => {
    return (currentTime.value = dayjs(currentTime.value).add(days, 'd').toDate())
  }

  const updateTime = () => {
    currentTime.value = new Date()
  }


  const dailyUpdateProjects = () => {
    Object.values(projects.value).forEach((project) => {
      // todo
    })
  }


  return { projects, currentProject, isActive, setSelected, addProject, currentTime, addDays, updateTime }
})
