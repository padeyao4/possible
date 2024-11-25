<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useGraph } from '@/stores';
import { onMounted } from 'vue';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';

const graph = useGraph();

onMounted(() => {
  for (let i = 0; i < 10; i++) {
    graph.addProject({
      x: 0,
      y: 0,
      description: '',
      id: v4(),
      index: i,
      name: faker.person.fullName()
    });
  }
  graph.projects.forEach((project) => {
    for (let i = 0; i < 20; i++) {
      graph.addNode({
        description: '',
        id: v4(),
        name: faker.location.county(),
        projectId: project.id,
        status: false,
        w: faker.number.int({ min: 1, max: 5 }),
        h: faker.number.int({ min: 1, max: 5 }),
        x: faker.number.int({ min: 1, max: 50 }),
        y: faker.number.int({ min: 1, max: 15 })
      });
    }
  });
  graph.projects.forEach((project) => {
    const nodes = graph.getNodesByProjectId(project.id);
    for (let i = 0; i < faker.number.int({ min: 5, max: 10 }); i++) {
      let index1 = faker.number.int({ min: 0, max: nodes.length - 1 });
      let index2 = faker.number.int({ min: 0, max: nodes.length - 1 });
      if (index1 !== index2) {
        let node1 = nodes[index1];
        let node2 = nodes[index2];
        if (node1.x > node2.x) {
          [node1, node2] = [node2, node1];
        }
        graph.addEdge(node1,node2)
      }
    }
  });
});
</script>

<template>
  <router-view />
</template>
