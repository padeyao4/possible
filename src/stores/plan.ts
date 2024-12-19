import { defineStore } from 'pinia';
import { days, generateIndex, useLayoutStore } from '.';
import { v4 } from 'uuid';
import { DataControllerApi } from '@/openapi';

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
    isExpanded?: boolean; // 是否展开子节点
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
    // 宽度,当值不存在时，表示不绘制
    width?: number;
    // 高度,当值不存在时，表示不绘制
    height?: number;
    // 偏移量
    offsetX?: number;
    offsetY?: number;
    [key: string]: any;
}

// 卡片尺寸常量
export const CARD_CONSTRAINTS = {
    MIN_WIDTH: 1,  // 最小宽度(格)
    MIN_HEIGHT: 1, // 最小高度(格)
    MAX_WIDTH: 10, // 最大宽度(格)
    MAX_HEIGHT: 5, // 最大高度(格)
    GRID_WIDTH: 120,  // 网格宽度(px)
    GRID_HEIGHT: 80   // 网格高度(px)
} as const;

// 调整现有的 CARD_WIDTH 和 CARD_HEIGHT 常量
export const CARD_WIDTH = CARD_CONSTRAINTS.GRID_WIDTH;
export const CARD_HEIGHT = CARD_CONSTRAINTS.GRID_HEIGHT;
const OFFSET_LEN = 20

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
    isExpanded?: boolean; // 是否展开,会影响子节点是否显示
    children?: string[]; // 子节点
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
        getAbsolutePosition: (state) => (plan: Plan) => {
            let absoluteX = plan.x ?? 0;
            let absoluteY = plan.y ?? 0;
            let current = plan;
            while (current.parentId) {
                const parent = state.plansMap.get(current.parentId);
                if (!parent) break;
                absoluteX += parent.x ?? 0;
                absoluteY += parent.y ?? 0;
                current = parent;
            }
            return { x: absoluteX, y: absoluteY };
        },
        // 判断节点是否应该显示
        shouldShowPlan: (state) => (plan: Plan, projectId: string) => {
            let parent = state.plansMap.get(plan.parentId!);
            while (parent && parent.isExpanded) {
                if (parent.id === projectId) {
                    return true;
                }
                parent = state.plansMap.get(parent.parentId!);
            }
            return false;
        },
        visibleCardsWithPositions(): Map<string, Card> {
            const cardsMap = new Map<string, Card>();
            // 处理所有计划
            Array.from(this.plansMap.values())
                .filter((plan) => this.shouldShowPlan(plan, this.projectId!))
                .map(plan => {
                    // 获取绝对坐标
                    const absPos = this.getAbsolutePosition(plan);
                    // 转换为Card对象
                    return {
                        id: plan.id,
                        name: plan.name,
                        x: absPos.x * CARD_WIDTH,
                        y: absPos.y * CARD_HEIGHT,
                        width: plan.width! * CARD_WIDTH,
                        height: plan.height! * CARD_HEIGHT,
                        color: plan.isDone ? '#ddd' : '#fff',
                        left: {
                            x: absPos.x * CARD_WIDTH,
                            y: (absPos.y + plan.height! / 2) * CARD_HEIGHT
                        },
                        right: {
                            x: (absPos.x + plan.width!) * CARD_WIDTH,
                            y: (absPos.y + plan.height! / 2) * CARD_HEIGHT
                        },
                        children: plan.childrenIds,
                        isExpanded: plan.isExpanded,
                    }
                })
                .map(card => {
                    // 应用偏移
                    if (card.isExpanded) {
                        return {
                            ...card,
                            x: card.x + OFFSET_LEN / 4,
                            y: card.y + OFFSET_LEN / 4,
                            width: card.width - OFFSET_LEN / 2,
                            height: card.height - OFFSET_LEN / 2,
                            left: {
                                ...card.left,
                                x: card.x + OFFSET_LEN / 4
                            },
                            right: {
                                ...card.right,
                                x: card.x + card.width - OFFSET_LEN / 4
                            }
                        };
                    } else {
                        return {
                            ...card,
                            x: card.x + OFFSET_LEN / 2,
                            y: card.y + OFFSET_LEN / 2,
                            width: card.width - OFFSET_LEN,
                            height: card.height - OFFSET_LEN,
                            left: {
                                ...card.left,
                                x: card.x + OFFSET_LEN / 2
                            },
                            right: {
                                ...card.right,
                                x: card.x + card.width! - OFFSET_LEN / 2
                            }
                        };
                    }
                })
                .forEach(card => {
                    cardsMap.set(card.id, card);
                });
            return cardsMap;
        },
        tempPathWithCtls(): Path | undefined {
            if (!this.tempPath) return undefined;
            const from = this.tempPath?.from ?? this.visibleCardsWithPositions.get(this.tempPath?.fromId!)?.right;
            const to = this.tempPath?.to ?? this.visibleCardsWithPositions.get(this.tempPath?.toId!)?.left;

            if (!from || !to) return undefined;

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
            // 递归获取所有可见的节点及其关系
            const getVisibleRelations = (parentId: string): Path[] => {
                const parent = this.plansMap.get(parentId);
                if (!parent) return [];

                const paths: Path[] = [];

                // 获取当前层级的关系
                const currentLevelPaths = (parent.childrenIds ?? [])
                    .map(id => this.plansMap.get(id))
                    .filter(child => !!child)
                    .flatMap(child =>
                        (child!.nexts ?? []).map(next => {
                            const n1 = this.visibleCardsWithPositions.get(child!.id);
                            const n2 = this.visibleCardsWithPositions.get(next);
                            // 只有当两个节点都可见时才创建连线
                            if (n1 && n2) {
                                // 使用卡片的实际位置（��经是绝对坐标）
                                const path: Path = {
                                    id: `${child!.id}-${next}`,
                                    from: n1.right,
                                    to: n2.left,
                                    ctls: [{
                                        x: n1.right.x + (n2.left.x - n1.right.x) / 2,
                                        y: n1.right.y
                                    }, {
                                        x: n2.left.x - (n2.left.x - n1.right.x) / 2,
                                        y: n2.left.y
                                    }],
                                    fromId: child!.id,
                                    toId: next
                                };
                                return path;
                            }
                            return null;
                        })
                    ).filter((path): path is Path => !!path);

                paths.push(...currentLevelPaths);

                // 递归处理展开的子节点
                parent.childrenIds?.forEach(childId => {
                    const child = this.plansMap.get(childId);
                    if (child?.isExpanded) {
                        paths.push(...getVisibleRelations(childId));
                    }
                });

                return paths;
            };

            return getVisibleRelations(this.projectId!);
        },
        todoBacklogs(): Plan[] {
            return this.backlogs.filter(plan => !plan.isDone);
        },
        doneBacklogs(): Plan[] {
            return this.backlogs.filter(plan => plan.isDone);
        },
        todayPlans(): Plan[] {
            const set = new Set(this.backlogsList);
            const layoutStore = useLayoutStore();
            const idx = days(layoutStore.timestamp);

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
        },
        hasRelation: (state) => (fromId: string, toId: string) => {
            const plan = state.plansMap.get(fromId)!;
            return (plan.nexts ?? []).includes(toId) || (plan.prevs ?? []).includes(toId);
        },
    },
    actions: {
        addPlan(plan: Plan, isProject?: boolean, isBacklog?: boolean) {
            Object.assign(plan, {
                x: plan.x ?? 0,
                y: plan.y ?? 0,
                id: plan.id ?? v4(),
                name: plan.name ?? '未命名',
                createdAt: plan.createdAt ?? Date.now(),
                updatedAt: plan.updatedAt ?? Date.now(),
                parentId: plan.parentId ?? null,
                childrenIds: plan.childrenIds ?? [],
                nexts: plan.nexts ?? [],
                prevs: plan.prevs ?? [],
                index: plan.index ?? generateIndex(),
                offsetX: plan.offsetX ?? 0,
                offsetY: plan.offsetY ?? 0,
                isRepeat: plan.isRepeat ?? false,
                repeatType: plan.repeatType ?? 'none',
                repeatInterval: plan.repeatInterval ?? null,
                startAt: plan.startAt ?? null,
                endAt: plan.endAt ?? null,
                description: plan.description ?? null,
                isDone: plan.isDone ?? false,
                isExpanded: plan.isExpanded ?? false,
            } as Plan);

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
                plan.isExpanded = true;
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
        },
        /**
         * 追加计划。继承上一个计划的后续依赖，并和上一个计划连接，将新计划插入到上一个计划之后
         * @param id 
         */
        appendPlan(id: string) {
            const plan = this.plansMap.get(id)!;
            const newPlanId = v4();
            const newPlan = {
                id: newPlanId,
                name: '未命名',
                x: plan.x! + plan.width!,
                y: plan.y!,
                width: 1,
                height: 1,
                index: generateIndex(),
                isDone: false,
                createdAt: Date.now(),
                parentId: plan.parentId,
            }
            this.addPlan(newPlan);
            plan.nexts?.forEach(next => {
                this.addRelation(newPlanId, next);
                this.removeRelation(id, next);
            });
            this.addRelation(id, newPlanId);
        },
        /**
         * 插入计划。将计划替换到当前任务的位置，被替换的任务后移一格，
         * 插入的计划继承当前位置计划的所有前依赖关系
         * @param id 
         */
        insertPlan(id: string) {
            const plan = this.plansMap.get(id)!;
            const newPlanId = v4();
            const newPlan = {
                id: newPlanId,
                name: 'untitled',
                x: plan.x!,
                y: plan.y!,
                width: 1,
                height: 1,
                index: generateIndex(),
                isDone: false,
                createdAt: Date.now(),
                parentId: plan.parentId,
            }
            this.addPlan(newPlan);
            plan.prevs?.forEach(prev => {
                this.addRelation(prev, newPlanId);
                this.removeRelation(prev, id);
            });
            this.addRelation(newPlanId, id);
            plan.x = plan.x! + 1;
        },
        /**
         * 移除计划所有依赖关系
         * @param id 
         */
        removeAllRelations(id: string) {
            const plan = this.plansMap.get(id)!;
            plan.prevs?.forEach(prev => {
                this.removeRelation(prev, id);
            });
            plan.nexts?.forEach(next => {
                this.removeRelation(id, next);
            });
        },
        /**
         * 根据时间戳更新计划位置
         */
        updatePlans() {
            const layoutStore = useLayoutStore();
            const idx = days(layoutStore.timestamp);
            const backlogsSet = new Set(this.backlogsList);
            const visibled = new Set<string>();
            const queue = [] as string[];
            Array.from(this.plansMap.values())
                .filter(plan => !plan.isDone)
                .filter(plan => !backlogsSet.has(plan.id!))
                .filter(plan => plan.x! + plan.width! - 1 < idx)
                .forEach(plan => {
                    if (visibled.has(plan.id!)) return;
                    visibled.add(plan.id!);
                    const dt = idx - (plan.x! + plan.width! - 1);
                    plan.width = plan.width! + dt;
                    queue.push(...(plan.nexts || []).filter(id => !visibled.has(id)));
                    while (queue.length > 0) {
                        const id = queue.shift()!;
                        if (visibled.has(id)) continue;
                        visibled.add(id);
                        const next = this.plansMap.get(id)!;
                        next.x = next.x! + dt;
                        queue.push(...(next.nexts || []).filter(id => !visibled.has(id)));
                    }
                });
        },

        async fetchPlans() {
            const resp = await new DataControllerApi().getPlans();
            const data = resp.data.payload;
            data?.plans?.forEach(plan => {
                this.plansMap.set(plan.id!, plan as Plan);
            });
            data?.projectIds?.forEach(id => {
                if (!this.projectsList.includes(id)) {
                    this.projectsList.push(id);
                }
            });
            data?.backlogIds?.forEach(id => {
                if (!this.backlogsList.includes(id)) {
                    this.backlogsList.push(id);
                }
            });
        },

        async savePlans() {
            const resp = await new DataControllerApi().savePlans({
                plans: Array.from(this.plansMap.values()),
                projectIds: this.projectsList,
                backlogIds: this.backlogsList,
            });
            if (resp.data.code === 0) {
                this.fetchPlans();
            }
        }
    },
})