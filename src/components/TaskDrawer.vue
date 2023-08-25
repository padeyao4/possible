<script lang="ts" setup>
const props = defineProps<{
  visible: boolean,
  taskId?: string
}>()

let emit = defineEmits(['update:visible'])

const value = $computed({
  get: () => {
    return props.visible
  },
  set: (v) => {
    emit('update:visible', v)
  }
})

</script>

<template>
  <el-drawer v-model="value"
             title="I am the title"
             :with-header="true"
             :close-on-click-modal="false"
             :show-close="true"
             @close="()=>{console.log('do close',value)}"
  >
    <span>Hi there!</span>
    <p>{{ props?.taskId}}</p>
  </el-drawer>
</template>

<style scoped>

</style>