import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { getIndex, useTimer } from './timer'
import type { ID, Node } from './types'

export const counter = defineStore('counter', () => {
  const mapper = reactive<Map<number, Set<ID>>>(new Map())
  const locationMap = reactive<Map<ID, number>>(new Map())

  const nodeIds = computed(() => {
    const timer = useTimer()
    const curDay = timer.currentDays
    const set = mapper.get(curDay) ?? new Set()
    return Array.from(set)
  })

  function update(node: Node) {
    const index = getIndex(node)

    if (locationMap.has(node.id)) {
      const tmpIndex = locationMap.get(node.id)
      mapper.get(tmpIndex).delete(node.id)
      if (mapper.has(index)) {
        mapper.get(index).add(node.id)
      } else {
        mapper.set(index, new Set([node.id]))
      }
      locationMap.set(node.id, index)
    } else {
      locationMap.set(node.id, index)
      mapper.set(index, new Set([node.id]))
    }
  }

  return { update, nodeIds }
})
