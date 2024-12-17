import { defineStore } from 'pinia';
import { days, useDataStore } from '.';

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
    index: number;
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
    // 偏移量
    offsetX?: number;
    offsetY?: number;
}

export const CARD_WIDTH = 120;
export const CARD_HEIGHT = 80;

export interface Card {
    id: string;
    name: string;
    x: number; // 实际x点
    y: number; // 实际y点
    width: number; // 实际宽度
    height: number; // 实际高度
    color: string; // 根据状态设置颜色
    left: { x: number, y: number }; // 左侧锚点
    right: { x: number, y: number }; // 右侧锚点
}

export interface Path {
    id: string;
    from?: { x: number, y: number };
    to?: { x: number, y: number };
    ctls: { x: number; y: number; }[];
    fromId?: string;
    toId?: string;
}

export const usePlanStore = defineStore('plan', {
    state: () => ({
        backlogsList: [] as string[],
        projectsList: [] as string[],
        projectId: null as string | null,
        plansMap: new Map<string, Plan>(),
        tempPath: null as Path | null,
    }),

    getters: {
        getPlan: (state) => (id: string): Plan | undefined => {
            return state.plansMap.get(id);
        },
        project: (state) => {
            return state.projectId ? state.plansMap.get(state.projectId)! : null;
        },
        projects: (state) => {
            return state.projectsList.map(id => state.plansMap.get(id)!).sort((a, b) => a.index! - b.index!);
        },
        backlogs: (state) => {
            return state.backlogsList.map(id => state.plansMap.get(id)!).sort((a, b) => a.index! - b.index!);
        },
        cardsMap: (state) => {
            const cardsMap = new Map<string, Card>();
            Array.from(state.plansMap.values()).filter(plan => plan.parentId === state.projectId).map(plan => {
                cardsMap.set(plan.id, {
                    id: plan.id,
                    name: plan.name,
                    x: plan.x! * CARD_WIDTH,
                    y: plan.y! * CARD_HEIGHT,
                    width: plan.width! * CARD_WIDTH,
                    height: plan.height! * CARD_HEIGHT,
                    color: plan.isDone ? '#ddd' : '#fff',
                    left: { x: plan.x! * CARD_WIDTH, y: (plan.y! + plan.height! / 2) * CARD_HEIGHT },
                    right: { x: (plan.x! + plan.width!) * CARD_WIDTH, y: (plan.y! + plan.height! / 2) * CARD_HEIGHT },
                });
            });
            return cardsMap;
        },
        cards(): Card[] {
            return Array.from(this.cardsMap.values());
        },
        tempPathWithCtls(): Path | undefined {
            if (!this.tempPath) return undefined;
            const from = this.tempPath?.from ?? this.cardsMap.get(this.tempPath?.fromId!)!.right;
            const to = this.tempPath?.to ?? this.cardsMap.get(this.tempPath?.toId!)!.left;
            return {
                id: this.tempPath?.id!,
                from,
                to,
                ctls: [{
                    x: from.x + ((to.x - from.x) / 2),
                    y: from.y
                }, {
                    x: to.x - ((to.x - from.x) / 2),
                    y: to.y
                }]
            };
        },
        paths(): Path[] {
            return (this.plansMap.get(this.projectId!)?.childrenIds ?? [])
                .map(id => this.plansMap.get(id))
                .filter(child => !!child)
                .flatMap(child =>
                    (child.nexts ?? []).map(next => {
                        const n1 = this.cardsMap.get(child.id)!
                        const n2 = this.cardsMap.get(next)!
                        return {
                            id: `${child.id}-${next}`,
                            from: n1.right,
                            to: n2.left,
                            ctls: [{
                                x: n1.right.x + (n2.left.x - n1.right.x) / 2,
                                y: n1.right.y
                            }, {
                                x: n2.left.x - (n2.left.x - n1.right.x) / 2,
                                y: n2.left.y
                            }],
                            fromId: child.id,
                            toId: next
                        }
                    })
                ).filter(path => !!path);
        },
        todoBacklogs(): Plan[] {
            return this.backlogs.filter(plan => !plan.isDone);
        },
        doneBacklogs(): Plan[] {
            return this.backlogs.filter(plan => plan.isDone);
        },
        todayPlans(): Plan[] {
            const set = new Set(this.backlogsList);
            const dataStore = useDataStore();
            const idx = days(dataStore.timestamp);

            // 提取通用的过滤条件
            const isInTimeRange = (plan: Plan) => idx >= plan.x! && idx < plan.x! + plan.width!;
            const isNotBacklog = (plan: Plan) => !set.has(plan.id);

            return Array.from(this.plansMap.values()).filter((plan): plan is Plan => (
                !!plan &&
                isNotBacklog(plan) &&
                isInTimeRange(plan)
            )).sort((a, b) => a.index! - b.index!);
        },
        todoPlans(): Plan[] {
            return this.todayPlans.filter(plan => !plan.isDone);
        },
        donePlans(): Plan[] {
            return this.todayPlans.filter(plan => plan.isDone);
        }
    },
    actions: {
        addPlan(plan: Plan, isProject?: boolean, isBacklog?: boolean) {
            this.plansMap.set(plan.id, plan);

            if (plan.parentId) {
                (this.plansMap.get(plan.parentId)!).childrenIds = [...new Set([...((this.plansMap.get(plan.parentId)!).childrenIds || []), plan.id])];
            }
            plan.prevs?.forEach(prevId => {
                (this.plansMap.get(prevId)!).nexts = [...new Set([...((this.plansMap.get(prevId)!).nexts || []), plan.id])];
            });
            plan.nexts?.forEach(nextId => {
                (this.plansMap.get(nextId)!).prevs = [...new Set([...((this.plansMap.get(nextId)!).prevs || []), plan.id])];
            });

            if (isProject) {
                this.projectsList.push(plan.id);
            }
            if (isBacklog) {
                this.backlogsList.push(plan.id);
            }
        },
        removePlan(id: string) {
            this.projectsList = this.projectsList.filter(item => item !== id);
            this.plansMap.forEach(plan => {
                plan.prevs = plan.prevs?.filter(item => item !== id);
                plan.nexts = plan.nexts?.filter(item => item !== id);
                plan.childrenIds = plan.childrenIds?.filter(item => item !== id);
            });
            this.plansMap.get(id)!.childrenIds?.forEach(childId => {
                this.removePlan(childId);
            });
            this.plansMap.delete(id);
        },
        addRelation(from: string, to: string) {
            (this.plansMap.get(from)!).nexts = [...new Set([...((this.plansMap.get(from)!).nexts || []), to])];
            (this.plansMap.get(to)!).prevs = [...new Set([...((this.plansMap.get(to)!).prevs || []), from])];
        },
        removeRelation(from: string, to: string) {
            (this.plansMap.get(from)!).nexts = (this.plansMap.get(from)!).nexts?.filter(item => item !== to);
            (this.plansMap.get(to)!).prevs = (this.plansMap.get(to)!).prevs?.filter(item => item !== from);
        },
        setProjectId(id: string) {
            this.projectId = id;
        }
    },
})