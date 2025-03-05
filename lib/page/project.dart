import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/node.dart';
import 'package:possible/page/demo.dart';
import 'package:possible/state/state.dart';
import 'package:uuid/v4.dart';

class ProjectPage extends GetView<DataController> {
  const ProjectPage({super.key});

  @override
  Widget build(BuildContext context) {
    // 获取传递过来的项目对象
    final Rx<Plan> project = Get.arguments;

    return Scaffold(
        appBar: AppBar(
          // 使用项目名称作为标题
          title: Text(project.value.name),
        ),
        body: Column(
          children: [
            Divider(
              height: 1,
              thickness: 0.5,
              color: Theme.of(context).dividerColor,
            ),
            Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  padding: EdgeInsets.only(left: 16),
                  alignment: Alignment.centerLeft,
                  child: Transform.scale(
                    scale: 1, // 可以调整此值来改变图标大小
                    child: Icon(
                      Icons.lock_open_outlined,
                      weight: 10,
                      color: Colors.black.withAlpha(196),
                    ),
                  ),
                ),
                Expanded(
                    child: Container(
                  height: 56,
                  decoration: BoxDecoration(
                    color: Colors.transparent,
                  ),
                  child: Obx(() => GraphHeader(offset: project.value.offset)),
                ))
              ],
            ),
            Expanded(
              child: Row(
                children: [
                  Container(
                    width: 56,
                    decoration: BoxDecoration(
                      color: Colors.transparent,
                    ),
                    child: Obx(() => GraphRuler(offset: project.value.offset)),
                  ),
                  Expanded(child: ContentCanvas(project: project)),
                ],
              ),
            ),
            Divider(
              height: 1,
              thickness: 0.5,
              color: Theme.of(context).dividerColor,
            ),
            Container(
              color: Theme.of(context).colorScheme.surface,
              child: SizedBox(
                height: 48,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      style: ButtonStyle(),
                      onPressed: () {
                        project.update((value) {
                          value?.offset = Offset.zero;
                        });
                      },
                      icon: Transform.scale(
                        scale: 1.2, // 可以调整此值来改变图标大小
                        child: Icon(Icons.refresh_outlined),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ],
        ));
  }
}

class ContentCanvas extends StatelessWidget {
  ContentCanvas({
    super.key,
    required this.project,
  });

  final Rx<Plan> project;

  final Rx<Offset> keyDownPosition = Rx(Offset.zero);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onPanUpdate: (details) {
        project.update((value) {
          value?.offset += details.delta;
          if (value?.offset.dy != null && value!.offset.dy > 0) {
            value.offset = Offset(value.offset.dx, 0);
          }
        });
      },
      onTapDown: (details) {
        keyDownPosition.value = details.localPosition;
      },
      onTap: () {
        var newPlan = Plan(
            id: UuidV4().toString(),
            name: "",
            index: DateTime.now().millisecondsSinceEpoch);
        newPlan.position = Offset(
            ((keyDownPosition.value.dx - project.value.offset.dx) / xStep)
                .floorToDouble(),
            ((keyDownPosition.value.dy - project.value.offset.dy) / yStep)
                .floorToDouble());
        project.value.addChild(newPlan.obs);
      },
      child: Obx(() => Stack(children: [
            CustomPaint(
              painter: GridBackground(
                  offset: project.value.offset, context: context),
              child: Stack(children: [
                for (var child in project.value.children)
                  PlanCard(child: child),
              ]),
            )
          ])),
    );
  }
}

const double kGridWidth = 120.0;
const double kGridHeight = 80.0;

class PlanCard extends StatelessWidget {
  const PlanCard({
    super.key,
    required this.child,
  });

  final Rx<Plan> child;

  @override
  Widget build(BuildContext context) {
    return Obx(() => Positioned(
        left: child.value.position.dx * kGridWidth +
            (child.value.parent?.offset.dx ?? 0),
        top: child.value.position.dy * kGridHeight +
            (child.value.parent?.offset.dy ?? 0),
        child: GestureDetector(
            onTap: () {
              Get.to(
                  () => ProjectDetail(
                        plan: child,
                      ),
                  transition: Transition.size);
            },
            onPanUpdate: (details) {
              // 更新 child.position
              child.update((value) {
                value?.position += Offset(details.delta.dx / kGridWidth,
                    details.delta.dy / kGridHeight);
              });
            },
            onPanEnd: (details) {
              // 确保 position 是整数
              child.update((value) {
                value?.position = Offset(value.position.dx.roundToDouble(),
                    value.position.dy.roundToDouble());
              });
            },
            child: Container(
                width: kGridWidth,
                height: kGridHeight,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(child: Text(child.value.name))))));
  }
}

class GraphHeader extends StatelessWidget {
  final Offset offset;

  const GraphHeader({super.key, required this.offset});

  String formatDate(DateTime date) {
    return '${date.year}/${date.month.toString()}/${date.day.toString()}';
  }

  String getWeekdayInfo(int index, int delta) {
    final date = DateTime.fromMillisecondsSinceEpoch(0)
        .add(Duration(days: index - delta));
    return '星期${date.weekday}';
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final itemCount = (constraints.maxWidth / kGridWidth).ceil() + 2;
      var realValue = offset.dx / kGridWidth;
      var delta = realValue < 0 ? realValue.floor() + 1 : realValue.toInt() + 1;
      return Stack(
        children: [
          Positioned(
            left: (offset.dx % kGridWidth).roundToDouble() - kGridWidth,
            child: Row(
              children: List.generate(
                itemCount,
                (index) {
                  return Container(
                    width: kGridWidth,
                    height: 56,
                    color: Colors.transparent,
                    alignment: Alignment.center,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          formatDate(DateTime.fromMillisecondsSinceEpoch(0)
                              .add(Duration(days: index - delta))),
                          style: TextStyle(fontSize: 13), // 设置文本大小为中
                        ),
                        Text(
                          getWeekdayInfo(index, delta),
                          style: TextStyle(fontSize: 13), // 设置文本大小为中
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          )
        ],
      );
    });
  }
}

class GraphRuler extends StatelessWidget {
  final Offset offset;

  const GraphRuler({super.key, required this.offset});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final itemCount = (constraints.maxHeight / kGridHeight).ceil() + 2;
      var realValue = offset.dy / kGridHeight;
      // 计算垂直偏移量相对于网格高度的倍数，并向下取整
      var delta = realValue < 0 ? realValue.floor() : realValue.truncate();
      return Stack(
        children: [
          Positioned(
            top: (offset.dy % kGridHeight).roundToDouble() - kGridHeight,
            child: Column(
              children: List.generate(
                itemCount,
                (index) => Container(
                  width: 56,
                  height: kGridHeight,
                  alignment: Alignment.center,
                  child: Text(
                    (index - delta).toString(),
                  ),
                ),
              ),
            ),
          )
        ],
      );
    });
  }
}

class GridBackground extends CustomPainter {
  Offset offset;
  BuildContext context;

  GridBackground({required this.offset, required this.context});

  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = Theme.of(context).dividerColor.withAlpha(64)
      ..style = PaintingStyle.stroke
      ..isAntiAlias = false
      ..strokeWidth = 1;

    final rectPaint = Paint()
      ..color = Colors.green.withAlpha(32)
      ..style = PaintingStyle.fill;

    canvas.drawLine(Offset.zero, Offset(0, size.height), gridPaint);
    canvas.drawLine(Offset.zero, Offset(size.width, 0), gridPaint);

    for (double x = 0; x < size.width; x += kGridWidth) {
      var rx = (x + offset.dx % kGridWidth).roundToDouble();
      canvas.drawLine(Offset(rx, 0), Offset(rx, size.height), gridPaint);

      // 绘制矩形示例，假设矩形的左上角坐标为 (100, 100)，宽度为 200，高度为 150
      var round = ((x - offset.dx) / kGridWidth).ceil();
      if (round % 7 == 2 || round % 7 == 3) {
        canvas.drawRect(
            Rect.fromLTWH(rx, 0, kGridWidth, size.height), rectPaint);
      }
      if (x == kGridWidth && (round % 7 == 4 || round % 7 == 5)) {
        canvas.drawRect(
            Rect.fromLTWH(0, 0, rx - kGridWidth, size.height), rectPaint);
      }
    }

    for (double y = 0; y < size.height; y += kGridHeight) {
      canvas.drawLine(
          Offset(0, (y + offset.dy % kGridHeight).roundToDouble()),
          Offset(size.width, (y + offset.dy % kGridHeight).roundToDouble()),
          gridPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}

// 定义常量，用于设置样式
const double borderRadiusValue = 8;
const double borderWidth = 1.0;
const double iconScale = 0.8;
const int hintTextAlpha = 64;

class ProjectDetail extends StatelessWidget {
  final Rx<Plan> plan;

  const ProjectDetail({super.key, required this.plan});
  // 焦点监听逻辑
  void setupFocusListener(
      FocusNode focusNode, TextEditingController controller) {
    focusNode.addListener(() {
      if (!focusNode.hasFocus) {
        final newValue = controller.text;
        plan.update((value) {
          value?.name = newValue;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.tertiaryContainer,
      appBar: AppBar(),
      body: Container(
        decoration: BoxDecoration(color: Theme.of(context).colorScheme.surface),
        child: Column(
          children: [
            Expanded(
              child: Column(
                children: [
                  Obx(() {
                    var focusNode = FocusNode();
                    var textEditingController =
                        TextEditingController(text: plan.value.name);
                    setupFocusListener(focusNode, textEditingController);
                    return Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          borderRadius:
                              BorderRadius.circular(borderRadiusValue),
                          color: Colors.grey[100],
                          border: Border.all(
                            color: Colors.grey.shade300,
                            width: borderWidth,
                          ),
                        ),
                        child: ListTile(
                          leading: Transform.scale(
                            scale: iconScale,
                            child: IconButton(
                              onPressed: () {
                                plan.update((value) {
                                  value?.completed = !value.completed;
                                });
                              },
                              icon: Icon(plan.value.completed
                                  ? Icons.check_circle_outline
                                  : Icons.circle_outlined),
                            ),
                          ),
                          title: TextField(
                            focusNode: focusNode,
                            controller: textEditingController,
                            decoration: InputDecoration(
                              hintText: '请输入内容',
                              hintStyle: TextStyle(
                                  color: Colors.black.withAlpha(hintTextAlpha)),
                              enabledBorder: UnderlineInputBorder(
                                borderSide:
                                    BorderSide(color: Colors.transparent),
                              ),
                              focusedBorder: UnderlineInputBorder(
                                borderSide:
                                    BorderSide(color: Colors.transparent),
                              ),
                            ),
                            onSubmitted: (newValue) {
                              plan.update((value) {
                                value?.name = newValue;
                              });
                            },
                          ),
                        ),
                      ),
                    );
                  })
                ],
              ),
            ),
            Divider(
              height: 1,
            ),
            Container(
              height: 48,
              alignment: Alignment.centerRight,
              child: Padding(
                padding: const EdgeInsets.only(right: 16),
                child: IconButton(
                  onPressed: () {
                    plan.value.parent?.removeChild(plan);
                    Get.back();
                  },
                  icon: Icon(Icons.delete_outline),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
