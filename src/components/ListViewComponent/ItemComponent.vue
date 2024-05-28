<script setup lang="ts">
import { useProjects, type Node } from '@/stores/projects'
import { computed, ref } from 'vue';

const props = defineProps<{
    node: Node
}>()

const projects = useProjects()

const project = computed(() => projects.getProject(props.node.projectId))
const over = ref(false)

</script>
<template>
    <div class="item">
        <div class="icon">
            <my-icon :icon="over ? 'solar:check-circle-linear' : 'solar:record-line-duotone'" @mouseenter="over = true"
                @mouseleave="over = false" />
        </div>
        <div class="content">
            <div class="one">
                {{ node.name }}
            </div>
            <div class="two">
                {{ project?.name }}
            </div>
        </div>
        <my-icon icon="iconoir:menu" class="operation move" />
    </div>
</template>
<style scoped>
.item {
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin-bottom: 4px;
    height: 56px;
    border-radius: 4px;
    overflow-x: hidden;
    background: rgba(255, 255, 255, 0.8);

    .icon {
        display: flex;
        align-items: start;
        justify-content: center;
        flex-shrink: 0;
        width: max-content;
        height: 100%;
        padding-top: 10px;
        padding-right: 12px;

        &>* {
            width: 24px;
            height: 24px;
        }
    }

    .content {
        flex-grow: 1;

        .one {
            height: 28px;
            display: flex;
            align-items: end;
            font-size: 15px;
            color: #000000;
        }

        .two {
            height: 28px;
            font-size: 13px;
        }
    }

    .operation {
        width: fit-content;
        flex-shrink: 0;
        height: 100%;
        width: 24px;
    }
}
</style>