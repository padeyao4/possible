<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { days, generateIndex, useAccountStore, useBacklogStore, useGraph } from '@/stores'
import { v4 } from 'uuid'
import { faker } from '@faker-js/faker'
import { useWindowSize } from '@vueuse/core'
import { watchEffect } from 'vue'
import router from '@/router'
import { BacklogControllerApi } from '@/openapi'

const graph = useGraph()
const accountStore = useAccountStore()
const { width, height } = useWindowSize()
const backlogStore = useBacklogStore()

new BacklogControllerApi().list().then((res) => {
  const payload = res.data.payload
  payload.forEach((item) => {
    backlogStore.backlogsMap.set(item.id, {
      id: item.id,
      index: item.index,
      loading: false,
      name: item.name,
      status: item.status,
    })
  })
})

watchEffect(() => {
  graph.viewWidth = width.value
  graph.viewHeight = height.value
})

watchEffect(() => {
  // 没有token时跳转到登录页面
  console.log('watch effect, accountStore', accountStore.token)
  if (!accountStore.token) {
    setTimeout(() => {
      router.push({ name: 'login' })
    })
  }
})

for (let i = 0; i < 10; i++) {
  graph.setProject({
    x: 0,
    y: 0,
    createdAt: faker.date
      .between({
        from: '1900-01-01T00:00:00.000Z',
        to: '2100-01-01T00:00:00.000Z'
      })
      .getTime(),
    description: '',
    id: v4(),
    index: generateIndex(),
    name: faker.person.fullName()
  })
}
graph.projects.forEach((project) => {
  for (let i = 0; i < 20; i++) {
    graph.setNode({
      index: generateIndex(),
      record: faker.word.words({ count: 50 }),
      detail: faker.word.words({ count: 50 }),
      id: v4(),
      name: faker.location.county(),
      projectId: project.id,
      status: false,
      w: faker.number.int({ min: 1, max: 5 }),
      h: faker.number.int({ min: 1, max: 5 }),
      x: faker.number.int({ min: 1, max: 50 }) + days(project.createdAt),
      y: faker.number.int({ min: 1, max: 15 })
    })
  }
})
graph.projects.forEach((project) => {
  const nodes = graph.getNodesByProjectId(project.id)
  for (let i = 0; i < faker.number.int({ min: 5, max: 10 }); i++) {
    let index1 = faker.number.int({ min: 0, max: nodes.length - 1 })
    let index2 = faker.number.int({ min: 0, max: nodes.length - 1 })
    if (index1 !== index2) {
      let node1 = nodes[index1]
      let node2 = nodes[index2]
      if (node1.x > node2.x) {
        [node1, node2] = [node2, node1]
      }
      graph.setEdge({
        id: v4(),
        projectId: node1.projectId,
        source: node1.id,
        target: node2.id
      })
    }
  }
})
</script>

<template>
  <router-view />
</template>
