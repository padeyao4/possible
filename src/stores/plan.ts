import { defineStore } from 'pinia';

export interface Plan {
    id: string;
    name: string;
    description?: string;
    createdAt: number;
    updatedAt?: number;
    startAt?: number;
    endAt?: number;
    isDone?: boolean;
    parentId?: string;
    childrenIds?: string[];
    // 下一个计划
    nexts?: string[];
    // 上一个计划
    prevs?: string[];
    // 用于重要度排序
    index?: number;
    // 是否是重复计划
    isRepeat?: boolean;
    // 重复计划类型
    repeatType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    // 重复计划间隔
    repeatInterval?: number;
    // 坐标
    x?: number;
    y?: number;
    // 宽度
    width?: number;
    // 高度
    height?: number;
}

export const usePlanStore = defineStore('plan', {
    state: () => ({
        backlogs: [] as string[],
        projects: [] as string[],
        plansMap: new Map<string, Plan>(),
    }),
    actions: {
        addPlan(plan: Plan) {
            this.plansMap.set(plan.id, plan);
        },
    },
})