import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { toX, toY } from '@/g6/utils/position-util'
import { useRoute } from 'vue-router'

export const useStore = defineStore('store', () => {
  const projects = ref<any>({
    'aaa': {
      id: 'aaa',
      name: 'test',
      completed: false,
      nodes: [
        {
          id: '1',
          data: {
            name: '1',
            x: toX(1),
            y: toY(2)
          }
        },
        {
          id: '2', data: {
            name: '2', x: toX(3), y: toY(4)
          }
        }],
      edges: [
        {
          id: 'e-1', source: '1', target: '2'
        }
      ],
      sortIndex: 0,
      editable: false
    },
    'bbb': {
      id: 'bbb',
      name: 'test2',
      completed: false,
      nodes: [],
      edges: [],
      sortIndex: 1,
      editable: false
    }
  })

  const selected = ref<any>('today')

  const currentProject = computed(() => {
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

  return { projects, currentProject, isActive, setSelected, sortedProjects, addProject }
})
