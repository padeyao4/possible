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
            const getPosition = (current: Plan): { x: number, y: number } => {
                if (!current.parentId) {
                    return {
                        x: current.x ?? 0,
                        y: current.y ?? 0
                    };
                }

                const parent = state.plansMap.get(current.parentId);
                if (!parent) {
                    return {
                        x: current.x ?? 0,
                        y: current.y ?? 0
                    };
                }

                const parentPos = getPosition(parent);
                return {
                    x: (current.x ?? 0) + parentPos.x,
                    y: (current.y ?? 0) + parentPos.y
                };
            };

            return getPosition(plan);
        },
        // 判断节点是否应该显示
        shouldShowPlan: (state) => (plan: Plan, projectId: string) => {
            const checkParent = (parentId: string | undefined): boolean => {
                if (!parentId) return false;

                const parent = state.plansMap.get(parentId);
                if (!parent) return false;

                if (parent.id === projectId) return true;

                return parent.isExpanded && checkParent(parent.parentId) || false;
            };
            return checkParent(plan.parentId) || false;
        },
        visibleCardsWithPositions(): Map<string, Card> {
            // 创建卡片转换函数
            const createCard = (plan: Plan) => {
                const absPos = this.getAbsolutePosition(plan);
                const baseX = absPos.x * CARD_WIDTH;
                const baseY = absPos.y * CARD_HEIGHT;
                const baseWidth = plan.width! * CARD_WIDTH;
                const baseHeight = plan.height! * CARD_HEIGHT;

                return {
                    id: plan.id,
                    name: plan.name,
                    x: baseX,
                    y: baseY,
                    width: baseWidth,
                    height: baseHeight,
                    color: plan.isDone ? '#ddd' : '#fff',
                    left: {
                        x: baseX,
                        y: baseY + (baseHeight / 2)
                    },
                    right: {
                        x: baseX + baseWidth,
                        y: baseY + (baseHeight / 2)
                    },
                    children: plan.childrenIds,
                    isExpanded: plan.isExpanded,
                };
            };

            // 应用偏移量
            const applyOffset = (card: Card) => {
                const offset = card.isExpanded ? OFFSET_LEN / 4 : OFFSET_LEN / 2;
                const totalOffset = card.isExpanded ? OFFSET_LEN / 2 : OFFSET_LEN;

                const newX = card.x + offset;
                const newWidth = card.width - totalOffset;

                return {
                    ...card,
                    x: newX,
                    y: card.y + offset,
                    width: newWidth,
                    height: card.height - totalOffset,
                    left: {
                        ...card.left,
                        x: newX
                    },
                    right: {
                        ...card.right,
                        x: newX + newWidth
                    }
                };
            };
            // 处理所有可见计划
            return new Map(
                Array.from(this.plansMap.values())
                    .filter(plan => this.shouldShowPlan(plan, this.projectId!))
                    .map(createCard)
                    .map(applyOffset)
                    .map(card => [card.id, card])
            );
        },
        tempPathWithCtls(): Path | undefined {
            // 如果没有临时路径则返回undefined
            if (!this.tempPath) return undefined;

            // 获取起点和终点坐标
            const { fromId, toId, from: tempFrom, to: tempTo, id } = this.tempPath;
            const from = tempFrom ?? this.visibleCardsWithPositions.get(fromId!)?.right;
            const to = tempTo ?? this.visibleCardsWithPositions.get(toId!)?.left;

            if (!from || !to) return undefined;

            // 计算控制点的x轴距离
            const xDistance = to.x - from.x;
            const halfDistance = xDistance / 2;

            return {
                id,
                from,
                to,
                ctls: [
                    { x: from.x + halfDistance, y: from.y },
                    { x: to.x - halfDistance, y: to.y }
                ]
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
        isBoxContainsDescendants: (state) => (plan: Plan) => {
            // 如果没有子节点或者未展开,直接返回true
            if (!plan.childrenIds?.length) {
                return true;
            }

            const box = {
                left: plan.x!,
                right: plan.x! + plan.width!,
                top: plan.y!,
                bottom: plan.y! + plan.height!
            };

            // 递归检查所有子孙节点
            const checkDescendants = (id: string): boolean => {
                const child = state.plansMap.get(id)!;

                // 检查当前节点是否在盒子范围内
                if (child.x! < box.left ||
                    child.x! + child.width! > box.right ||
                    child.y! < box.top ||
                    child.y! + child.height! > box.bottom) {
                    return false;
                }

                // 如果有展开的子节点,递归检查
                if (child.childrenIds?.length) {
                    return child.childrenIds.every(checkDescendants);
                }
                return true;
            };

            return plan.childrenIds.every(checkDescendants);
        },
        isOverlapping: () => (plan1: Plan, plan2: Plan) => {
            // 如果不是同一个父节点，返回false
            if (plan1.parentId !== plan2.parentId) {
                return false;
            }

            // 获取两个plan的边界
            const box1 = {
                left: plan1.x!,
                right: plan1.x! + plan1.width!,
                top: plan1.y!,
                bottom: plan1.y! + plan1.height!
            };

            const box2 = {
                left: plan2.x!,
                right: plan2.x! + plan2.width!,
                top: plan2.y!,
                bottom: plan2.y! + plan2.height!
            };

            // 检查是否重叠
            return !(
                box1.right <= box2.left ||  // box1在box2左边
                box1.left >= box2.right ||  // box1在box2右边
                box1.bottom <= box2.top ||  // box1在box2上边
                box1.top >= box2.bottom     // box1在box2下边
            );
        },
        // 获取plan及其子孙节点的包围盒范围
        getBoundingBox: (state) => (plan: Plan) => {
            // 初始化包围盒为当前节点的范围
            const box = {
                left: plan.x!,
                right: plan.x! + plan.width!,
                top: plan.y!,
                bottom: plan.y! + plan.height!
            };

            // 递归检查所有子孙节点
            const checkDescendants = (id: string, parentX: number, parentY: number) => {
                const child = state.plansMap.get(id)!;
                if (!child) return;

                // 计算子节点的绝对坐标
                const absoluteX = parentX + child.x!;
                const absoluteY = parentY + child.y!;

                // 更新包围盒范围
                box.left = Math.min(box.left, absoluteX);
                box.right = Math.max(box.right, absoluteX + child.width!);
                box.top = Math.min(box.top, absoluteY);
                box.bottom = Math.max(box.bottom, absoluteY + child.height!);

                // 递归检查子节点，传递当前节点的绝对坐标
                child.childrenIds?.forEach(childId => checkDescendants(childId, absoluteX, absoluteY));
            };

            // 检查所有子节点，传递父节点的坐标
            plan.childrenIds?.forEach(id => checkDescendants(id, plan.x!, plan.y!));

            return box;
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
            // 从项目列表中移除
            this.projectsList = this.projectsList.filter(item => item !== id);

            const plan = this.plansMap.get(id)!;

            // 删除父节点中的children记录
            if (plan.parentId) {
                const parent = this.plansMap.get(plan.parentId)!;
                parent.childrenIds = parent.childrenIds?.filter(item => item !== id);
            }

            // 删除所有相关联的prevs和nexts
            plan.prevs?.forEach(prevId => {
                const prevPlan = this.plansMap.get(prevId)!;
                prevPlan.nexts = prevPlan.nexts?.filter(item => item !== id);
            });

            plan.nexts?.forEach(nextId => {
                const nextPlan = this.plansMap.get(nextId)!;
                nextPlan.prevs = nextPlan.prevs?.filter(item => item !== id);
            });

            // 递归删除所有子孙节点
            plan.childrenIds?.forEach(childId => {
                this.removePlan(childId);
            });

            // 最后删除自身
            this.plansMap.delete(id);
        },
        addRelation(from: string, to: string) {
            const fromPlan = this.plansMap.get(from)!;
            const toPlan = this.plansMap.get(to)!;

            fromPlan.nexts = [...new Set([...(fromPlan.nexts || []), to])];
            toPlan.prevs = [...new Set([...(toPlan.prevs || []), from])];
        },
        removeRelation(from: string, to: string) {
            const fromPlan = this.plansMap.get(from)!;
            const toPlan = this.plansMap.get(to)!;

            fromPlan.nexts = fromPlan.nexts?.filter(item => item !== to);
            toPlan.prevs = toPlan.prevs?.filter(item => item !== from);
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
            const projectsSet = new Set(this.projectsList);


            // 更新计划及其后续计划的位置
            const updatePlanPosition = (plan: Plan) => {
                if (visibled.has(plan.id!)) return;

                visibled.add(plan.id!);
                const dt = idx - (this.getAbsolutePosition(plan).x + plan.width! - 1);
                plan.width = plan.width! + dt;

                // 使用递归代替队列,更新所有后续计划
                const updateNextPlans = (planId: string) => {
                    if (visibled.has(planId)) return;

                    visibled.add(planId);
                    const next = this.plansMap.get(planId)!;
                    next.x = next.x! + dt;

                    next.nexts?.forEach(nextId => {
                        if (!visibled.has(nextId)) {
                            updateNextPlans(nextId);
                        }
                    });
                };

                plan.nexts?.forEach(nextId => {
                    if (!visibled.has(nextId)) {
                        updateNextPlans(nextId);
                    }
                });
            };

            // 筛选并更新需要处理的计划
            Array.from(this.plansMap.values())
                .filter(plan => !plan.isDone)
                .filter(plan => projectsSet.has(plan.parentId!))
                .filter(plan => this.getAbsolutePosition(plan).x + plan.width! - 1 < idx)
                .sort((a, b) => a.x! - b.x!)
                .forEach(updatePlanPosition);
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