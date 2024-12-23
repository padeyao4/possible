<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  icon?: string
  onClick?: () => void
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
}>()

const isHovered = ref(false)

const tooltipClasses = {
  top: '-top-[44px] left-1/2 transform -translate-x-1/2',
  bottom: '-bottom-[44px] left-1/2 transform -translate-x-1/2',
  left: 'top-1/2 -left-[100px] transform -translate-y-1/2',
  right: 'top-1/2 -right-[100px] transform -translate-y-1/2'
}

const tooltipArrowClasses = {
  top: 'bottom-[-8px] left-1/2 transform -translate-x-1/2 border-t-gray-700 border-t-[8px]',
  bottom: 'top-[-8px] left-1/2 transform -translate-x-1/2 border-b-gray-700 border-b-[8px]',
  left: 'right-[-8px] top-1/2 transform -translate-y-1/2 border-l-gray-700 border-l-[8px]',
  right: 'left-[-8px] top-1/2 transform -translate-y-1/2 border-r-gray-700 border-r-[8px]'
}
</script>

<template>
  <div 
    class="relative" 
    @mouseenter="isHovered = true" 
    @mouseleave="isHovered = false"
    @click="onClick"
  >
    <slot>
      <svg v-if="icon" :class="icon" />
    </slot>
    
    <div 
      v-if="title"
      class="absolute z-10 bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 transition-opacity duration-300 pointer-events-none min-w-[80px] text-center"
      :class="[
        tooltipClasses[tooltipPosition || 'top'], 
        { 'opacity-100': isHovered }
      ]"
    >
      {{ title }}
      <div 
        class="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent"
        :class="tooltipArrowClasses[tooltipPosition || 'top']"
      ></div>
    </div>
  </div>
</template> 