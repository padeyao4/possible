// import { defineStore } from 'pinia';
// import { computed, reactive, ref, toRaw } from 'vue';
// import { getIndexByDate } from './timer';
// import { Node, Project } from '@/core';
// import type { ID } from '@/core/types';
//
// export const useProjects = defineStore('projects', () => {
//   const mapper = reactive<Map<ID, Project>>(new Map());
//
//   const sortProjects = computed(() => {
//     return Array.from(mapper.values()).sort((p1, p2) => p1.sortIndex - p2.sortIndex);
//   });
//
//   const nodes = computed(() => {
//     return Array.from(mapper.values())
//       .map((project) => {
//         const curX = getIndexByDate(<Project>project);
//         const { nodeMap } = project;
//         return Array.from(nodeMap.values()).filter((node) => {
//           return node.x <= curX && curX < node.x + node.width;
//         });
//       })
//       .flat()
//       .sort((a, b) => {
//         return a.sortedIndex - b.sortedIndex;
//       });
//   });
//
//   const todoList = computed(() => {
//     return nodes.value.filter((node) => node.completed === false);
//   });
//
//   const completedList = computed(() => {
//     return nodes.value.filter((node) => node.completed === true);
//   });
//
//   const todayTodoList = computed(() => {
//     return todoList.value.filter((node) => {
//       const project = mapper.get(node.projectId);
//       const curX = getIndexByDate(project);
//       return node.x <= curX && curX < node.x + node.width;
//     });
//   });
//
//   function faker() {
//     mapper.clear();
//     for (let i = 0; i < 10; i++) {
//       const project = Project.faker();
//       for (let j = 0; j < 10; j++) {
//         project.addNode(Node.faker());
//       }
//       mapper.set(project.id, project);
//     }
//   }
//
//   function addProject(project: Project): void {
//     mapper.set(project.id, project);
//   }
//
//   function removeProject(projectId: ID): void {
//     mapper.delete(projectId);
//   }
//
//   function deserialize(data: any[]): void {
//     data.forEach((obj) => {
//       addProject(Project.fromPlainObject(obj));
//     });
//   }
//
//   function serialize() {
//     return Array.from(mapper).map(([_, value]) => value.toPlainObject());
//   }
//
//   function toPlainObject() {
//     return toRaw(Array.from(mapper).map(([_, value]) => value.toPlainObject()));
//   }
//
//   function fromPlainObject(data: any[]) {
//     deserialize(data);
//   }
//
//   const fetchLoading = ref(false);
//
//   const pushLoading = ref(false);
//
//   function dailyUpdate() {
//     Array.from(mapper.values()).forEach((project) => {
//       project.dailyUpdate();
//     });
//   }
//
//   /**
//    * @param projectId
//    */
//   function getProject(projectId: ID) {
//     return mapper.get(projectId) ?? new Project();
//   }
//
//   function $reset() {
//     mapper.clear();
//   }
//
//   return {
//     mapper,
//     todoList,
//     completedList,
//     sortProjects,
//     todayTodoList,
//     addProject,
//     removeProject,
//     deserialize,
//     faker,
//     fetch,
//     fetchLoading,
//     pushLoading,
//     dailyUpdate,
//     getProject,
//     toPlainObject,
//     fromPlainObject,
//     $reset
//   };
// });
