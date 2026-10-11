# Weavex 画布：删除节点后 hover / 拖拽失效 —— 问题定位文档

> 状态：根因已通过「真实桌面复现 + 浏览器最小复现页」双向实锤，修复方案待后续处理。
> 日期：2026-10-11

---

## 1. 问题现象

### 1.1 复现操作序列（真实应用，测试图「111」）

1. 在绘制区域点击节点（如 T1），打开右侧编辑框；
2. 在绘制区域**右键任意节点**（如 T4），通过右键菜单「删除节点」删除（删除后 graph 会重新执行布局算法）；
3. 关闭编辑框；
4. 此时绘制区域**不再响应鼠标 hover（节点不高亮）与空白处拖拽（画布不动）**。

补充验证（用户在真实桌面验证）：

| # | 操作 | 结果 |
|---|------|------|
| 1 | 删除后滚轮缩放 | ✅ 正常 |
| 2 | 删除后空白处拖拽画布 | ❌ 纹丝不动 |
| 3 | 移出窗口再移回，hover | ❌ 高亮不恢复 |
| 4 | 删除后点击节点 | ✅ 正常（能打开编辑框） |
| 5 | 不打开编辑框直接右键删除 | ❌ 同样失效（**编辑框不是必要条件**） |
| 6 | 重启应用 | ✅ 恢复 |

### 1.2 关键结论

- **失效类目唯一为「pointermove 驱动的合成事件」**：hover（`node:pointer:enter/leave`）与 `dragstart`（拖拽）都依赖 pointermove；
- `click`（pointerdown/up 驱动）与 `wheel` 完好 → G 层事件系统本身没断，断的是 **pointermove 这条链路**；
- 失效是**永久性**的（移出窗口再移回不恢复），不是瞬时抖动。

---

## 2. 根因（证据链）

### 2.1 一句话根因

**删除节点后，已删除节点的 G 层图形元素没有从 @antv/g 场景树销毁（残留），仍在参与拾取（命中测试）。鼠标移动到残留元素位置时，G6 事件转发层（`BehaviorController.forwardCanvasEvents`）把事件转发给已删除的 id，应用层 hover listener 调用 `graph.getElementType(id)` 查询数据层 → 数据层已无该 id → 抛出 `[G6 v5.1.1] Unknown element type of id: xxx` 异常 → 异常中断 G 层 pointermove 事件派发链 → 后续逻辑（currentTarget 更新、dragstart 合成）全部被跳过 → hover 与拖拽永久失效。**

### 2.2 证据链逐步实锤

**证据 1：删除后 `currentTarget` 卡死在已删除节点的 id 上（真实应用诊断面板）**

删除 T4 后，右上角诊断面板：

```
animPlaying=false
currentTarget=d7957fe1-823a-4a6a-b782-92ec1d8a15dd   ← 已删除的 T4 的 id，永久不更新
elements=16                                            ← 从 19 降到 16（T4+边已从 elementMap 移除）
```

鼠标移到 T1 上，T1 不高亮，`currentTarget` 仍指向已删除的 T4。

**证据 2：浏览器最小复现页完整复现，并抛出 G6 内核异常**

复现页（`repro/`，同 G6 注册项 + contextmenu 右键删除 + 60ms watcher 模拟 + 布局重排）右键删除根节点 n1 后，鼠标移动即报：

```
GLOBAL ERROR: Uncaught Error: [G6 v5.1.1] Unknown element type of id: n1
  at DataController.getElementType (...g6.js:92439)
  at _Graph.<anonymous> (repro.ts:205)                 ← 应用 hover listener
  at doEmit
  at EventEmitter.emit
  at BehaviorController.forwardCanvasEvents (...g6.js:91563)   ← G6 事件转发层
  at EventService.notifyListeners / notifyTarget / propagate / dispatchEvent
```

**关键信息**：`forwardCanvasEvents` 收到的事件 target 是已删除的 `n1` → **说明 n1 的图形元素仍在 G 层场景树、仍参与拾取**（G6 的 elementMap 里其实已经删掉了，见证据 3）。

**证据 3：elementMap 已移除 n1，但 G 层拾取仍命中 n1**

复现页「检查 G6 内部状态」输出：

```
elementMap size=17 keys=n2,n3,n4,n5,n6,n7,n8,n9,n10,e2,e3,e4,e5,e6,e7,e8,e9   ← n1 已不在 elementMap
elementMap 中已销毁/待销毁元素: 无
animationPlaying = false
```

数据层（G6 elementMap）干净，但 G 层（@antv/g 场景树）残留 n1 → 拾取命中 → 事件转发到 n1 → listener 查数据层抛错。

**证据 4：拖拽失效的直接机制**

复现页删除后拖拽空白处，日志**完全没有 `canvas:DRAG_START`**，且拖拽期间**连 G 层诊断 `pointermove` 日志都消失** → 说明 G 层 pointermove 事件在派发链中途被异常中断（`forwardCanvasEvents` 抛错后，后续监听器——包括 dragndrop 插件的 `handlePointermove`——都没被执行），dragstart 无法合成。

**证据 5：为什么 click / wheel 正常（机制闭环）**

| 事件 | forwardCanvasEvents 转发后调用的 listener | 是否抛错 |
|------|------------------------------------------|----------|
| `click` | 应用 CLICK listener：`const node = currentGraph.value?.nodes[nodeId]; if (!node) { drawerNode.value = null; return; }` —— **先查数据，查不到直接 return，不调 getElementType** | ✅ 不抛 |
| `wheel` | zoom-canvas behavior，处理滚轮缩放，不查 `getElementType` | ✅ 不抛 |
| `pointerenter/leave` | 应用 hover listener：`if (id && graph.value?.getElementType(id) === "node")` —— **对已删 id 直接调 getElementType → 抛** | ❌ 抛 |
| `dragstart` 合成 | 依赖 pointermove 派发链不被中断（dragndrop 插件 `handlePointermove` 是 G 层后续监听器） | ❌ 链断 |

**click 能开编辑框（用户验证 4）与 hover 失效不矛盾：** CLICK listener 有数据层保护，POINTER_ENTER/LEAVE listener 没有。

### 2.3 残留元素为何不销毁（机制推断，源码依据）

G6 销毁元素走 `destroyElement`（`node_modules/@antv/g6/src/runtime/element.ts` L606）：

```ts
private destroyElement(elementType, datum, context) {
  ...
  this.animateElement(element, 'exit', {...}, {
    after: () => {
      this.clearElement(id);     // 从 elementMap 移除
      element.destroy();         // ← G 层真正销毁，从场景树移除
      ...
    },
  });
}
```

销毁动作挂在**动画 `after` 回调**里。而 `AnimationController.animate`（`runtime/animation.ts` L30）的实现是：

```ts
const animation = options.length ? executor(element, ...) : null;
if (animation) {
  animation.finished.then(() => { cb?.afterAnimate?.(); cb?.after?.(); ... });
} else cb?.after?.();
```

即：**只要有 exit 动画配置（本项目编辑期 `enableEditAnimation()` 打开 200ms 动画 + node 配置了 `animation.exit`），`element.destroy()` 就只在 `animation.finished` resolve 后执行；一旦该 Promise 未 resolve（动画被取消/中断/异常），`after` 永不执行 → 元素永久残留在 G 层场景树。**

> 说明：以上为源码层面的机制推断，最终证伪/证实需在残留元素上检查其 `destroyed` / `__to_be_destroyed__` / 动画状态（复现页已加「G 场景树残留检查」按钮，结果可复现验证）。

---

## 3. 关键代码与数据

### 3.1 应用层会抛错的 listener（`src/composables/useTaskGraph.ts` L607-625）

```ts
// 鼠标悬停节点：添加 hover 样式；移出节点时移除
graph.value.on(
  NodeEvent.POINTER_ENTER,
  (evt: IElementEvent & { target: Element }) => {
    const id = evt.target.id;
    if (id && graph.value?.getElementType(id) === "node") {   // ← 对已删 id 抛 "Unknown element type"
      setNodeStatus(id, "hover");
    }
  },
);
graph.value.on(
  NodeEvent.POINTER_LEAVE,
  (evt: IElementEvent & { target: Element }) => {
    const id = evt.target.id;
    if (id && graph.value?.getElementType(id) === "node") {   // ← 同
      clearNodeStatus(id, "hover");
    }
  },
);
```

边 hover 的 `EdgeEvent.POINTER_ENTER/LEAVE`（L627-644）同款问题。

### 3.2 G6 转发层（`node_modules/@antv/g6/src/runtime/behavior.ts` L68-98）

```ts
private forwardCanvasEvents = (event) => {
  const { target: originalTarget } = event;
  const target = eventTargetOf(originalTarget as DisplayObject);
  if (!target) return;
  const { type: targetType, element: targetElement } = target;
  // 即将销毁或已销毁的元素不再触发事件
  if ('destroyed' in targetElement && (isToBeDestroyed(targetElement) || targetElement.destroyed)) return;  // ← 依赖元素带 destroyed/__to_be_destroyed__ 标志

  ...
  if (type === CommonEvent.POINTER_MOVE) {
    if (this.currentTarget !== targetElement) {
      if (this.currentTarget) graph.emit(`${this.currentTargetType}:${POINTER_LEAVE}`, {...});   // ← 这里 emit 抛错
      if (targetElement) graph.emit(`${targetType}:${POINTER_ENTER}`, {...});                    // ← 这里 emit 抛错
    }
    this.currentTarget = targetElement;   // ← 永远执行不到，currentTarget 卡死
    this.currentTargetType = targetType;
  }
  ...
};
```

**注意**：L76 的 `destroyed` 拦截依赖残留元素带 `destroyed=true` 或 `__to_be_destroyed__=true`；复现页报错证明残留元素**没带这些标志**（否则会直接 return 而不抛错），所以拦截没有生效。

### 3.3 删除 / 数据同步主链路（`src/composables/useTaskGraph.ts`）

```ts
// 右键菜单：删除走此路径（动画开启 → store 删除 → watcher debounce 50ms → syncGraphData）
graph.value.on("contextmenu", ...)  // G6 内建 contextmenu 插件 onClick:
//   if (!current || animationPlaying.value) return;
//   enableEditAnimation();                       // graph.setOptions({ animation: EDIT_ANIMATION })  // 200ms
//   graphStore.removeNode(graphId, current.id, { persist, buildRoots, update });  // 级联删子树 + 重建 parent/nexts

// syncGraphData（watch allGraph → debounce 50ms 触发）
const syncGraphData = async function () {
  if (animationPlaying.value) return;             // 动画期间挂起（当前无兜底，依赖 AFTER_ANIMATE 复位）
  ...
  graph.value.setData(data);
  await graph.value.render();
  disableEditAnimation();                          // graph.setOptions({ animation: false })
};

// 动画状态
graph.value.on(GraphEvent.BEFORE_ANIMATE, () => { animationPlaying.value = true; });
graph.value.on(GraphEvent.AFTER_ANIMATE, () => { animationPlaying.value = false; });
```

### 3.4 真实应用诊断数据（TEMP-DEBUG 面板，`window.__graph` + `#g6-diag-panel`）

| 阶段 | animPlaying | currentTarget | elements |
|------|-------------|---------------|----------|
| 打开图（基线） | false | - | 19 |
| hover T3（基线） | false | 1885841a-…(T3) | 19 |
| 点击 T1 开编辑框 | false | 679f475e-…(T1) | 19 |
| 右键 T4 弹菜单 | false | d7957fe1-…(T4) | 19 |
| **删除 T4 后** | **false** | **d7957fe1-…(T4)（卡死）** | **16** |
| 鼠标移到 T1 | false | **仍 d7957fe1-…(T4)** | 16 |

### 3.5 复现页诊断数据（`repro/`）

```
[14:11:24] contextmenu onClick: node:delete on n1
[14:11:24] 右键删除: 等待 60ms 模拟 watcher debounce…
[14:11:24] syncGraphData: setData nodes=9 edges=8
[14:11:24] BEFORE_ANIMATE (animationPlaying=true)
[14:11:24] layout.execute: 输入节点=9 ...
[14:11:24] AFTER_ANIMATE (animationPlaying=false)
[14:11:24] render() done, animation reset
[14:11:25] POINTER_LEAVE: n1                      ← 鼠标移动，转发层开始转发已删 n1 的事件
[14:11:25] GLOBAL ERROR: [G6 v5.1.1] Unknown element type of id: n1
```

（注：删除 n5（中间节点）的对照路径此前验证 hover 正常 —— 说明**残留现象与「删除位置/级联范围」无关，是删除流程本身的 G 层销毁问题**；真实应用删任意节点都失效与此一致。）

---

## 4. 修复方向建议（供后续处理，未实施）

### 方案 A：应用层防御（最小改动，能恢复交互）

给 `POINTER_ENTER/LEAVE`（节点 + 边）listener 加数据层保护，命中已删除 id 时直接忽略、不调用 `getElementType`：

```ts
graph.value.on(NodeEvent.POINTER_ENTER, (evt) => {
  const id = evt.target.id;
  if (!id) return;
  const node = currentGraph.value?.nodes[id];       // 数据层先查，查不到直接忽略（不抛错）
  if (!node) return;
  if (graph.value?.getElementType(id) === "node") setNodeStatus(id, "hover");
});
```

- 效果：`forwardCanvasEvents` 不再因 listener 抛错中断 → `currentTarget` 正常更新 → hover 恢复；pointermove 派发链不断 → dragstart 合成恢复 → 拖拽恢复。
- 局限：**治标不治本**，残留元素仍在场景树、仍在拾取（有拾取开销），且每移过一次残留位置都会走一次空转发。
- 建议同时给 `clearNodeStatus` / `setNodeStatus` 内部对 `getElementState` 的调用做同类保护（`getElementState` 对已删 id 同样可能抛错）。

### 方案 B：根治残留（删除后确保 G 层元素真正销毁）

方向（按实现成本排序）：

1. **删除/变更后主动清理残留**：`syncGraphData` 的 `render()` 完成后，遍历 `graph.getCanvas().document` 场景树，把「不在当前数据里的节点/边元素」强制 `destroy()` 并移除（自实现清理函数，注意保留画布根容器）。
2. **删除路径不启用 exit 动画**：编辑期删除节点时保持 `animation: false`（或移除 node/edge 的 `animation.exit` 配置），让 G6 走 `else cb?.after?.()` 同步销毁分支，从根上避免「after 依赖 animation.finished」的问题；代价是删除节点无淡出动画。
3. **升级 @antv/g6**：排查 G6 v5.1.1 是否有后续版本修复「exit 动画 finished 未 resolve → 元素残留」的问题。

### 方案 C：事件层兜底（配合 A/B）

在 `BEFORE_ANIMATE` 后加兜底复位（曾有过类似实现，后被移除）：若 `AFTER_ANIMATE` 长时间未触发（动画被取消/异常），超时强制 `animationPlaying=false` 并补发一次 `syncGraphData`。此方案只解决「动画状态卡死」，**不能单独解决本文的残留/抛错问题**，需与 A 或 B 配合。

### 验证建议

- 复现页已具备完整链路（contextmenu 删除 + watcher 模拟 + G 层 pointermove/拾取诊断 + 场景树残留检查），修复后先在复现页验证：删除后 hover n2 有 `POINTER_ENTER`、拖拽有 `canvas:DRAG_START`、无 `Unknown element type` 报错、场景树残留检查为空；
- 再到真实应用验证用户三条：滚轮缩放 ✅ / 拖拽平移 ✅ / hover 高亮 ✅。

---

## 5. 附：复现方法

### 5.1 真实应用（dev 版）

1. 确保 dev 环境正常：vite 监听 `127.0.0.1:3300`（`scripts/start-dev-vite.ps1`），`C:\weavex-target\debug\weavex.exe` 窗口正常显示；
2. 打开测试图「111」（graph_id=`082dde0f-b6e8-45e1-8b1b-61693e0c4e99`），点击居中按钮让节点可见；
3. 点击节点开编辑框 → 右键另一节点 →「删除节点」→ 关闭编辑框；
4. 观察：hover 节点无高亮、空白处拖拽画布不动；滚轮缩放正常、点击节点仍能开编辑框。

### 5.2 浏览器最小复现页

- URL：`http://127.0.0.1:3300/repro/`
- 流程：右键 Node1 →「删除节点」（60ms 后自动 setData+render+重排）→ 移动鼠标到 Node2 → 日志区出现 `Unknown element type of id: n1` 报错，无 `POINTER_ENTER: n2`；拖拽空白处无 `canvas:DRAG_START`；
- 「检查 G6 内部状态」按钮可查看 elementMap 与 G 场景树残留。

---

## 6. 遗留待验证项

- [ ] 残留元素的确切状态（`destroyed` / `__to_be_destroyed__` / 动画 `finished` Promise 状态）——复现页已加检查，尚未跑出最终对照值；
- [ ] 方案 B-1（主动清理场景树残留）的最小实现验证；
- [ ] G6 升级可行性（v5.1.1 → 最新）与回归风险。

> 本文档为问题定位结论，代码/数据均为当日实验实证；修复方案待用户后续处理。
