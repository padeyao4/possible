import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/node.dart';
import 'package:possible/page/demo.dart';
import 'package:possible/state/state.dart';
import 'package:uuid/v4.dart';

class ProjectPage extends GetView<DataController> {
  final Rx<Plan> project; // 将 project 字段标记为 final

  const ProjectPage(this.project, {super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          // 使用项目名称作为标题
          title: Obx(() => Text(project.value.name)),
          actions: [
            IconButton(
                onPressed: () {
                  showMenu(
                    context: context,
                    position: RelativeRect.fromLTRB(
                      MediaQuery.of(context).size.width - 100,
                      kToolbarHeight,
                      MediaQuery.of(context).size.width,
                      kToolbarHeight + 100,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 8,
                    color: Theme.of(context).colorScheme.surface,
                    items: [
                      PopupMenuItem(
                        value: 'rename',
                        child: Row(
                          children: [
                            Transform.scale(
                              scale: 0.8,
                              child: Icon(
                                Icons.edit_outlined,
                              ),
                            ),
                            SizedBox(width: 8),
                            Text('重命名',
                                style: TextStyle(
                                    color: Theme.of(context)
                                        .colorScheme
                                        .onSurface)),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Transform.scale(
                              scale: 0.8, // 调整图标大小，可根据需要修改此值
                              child: Icon(
                                Icons.delete_outline,
                              ),
                            ),
                            SizedBox(width: 8),
                            Text('删除',
                                style: TextStyle(
                                    color: Theme.of(context)
                                        .colorScheme
                                        .onSurface)),
                          ],
                        ),
                      ),
                    ],
                  ).then((value) {
                    if (value != null) {
                      if (value == 'rename') {
                        final TextEditingController nameController =
                            TextEditingController(text: project.value.name);
                        Get.dialog(
                          AlertDialog(
                            title: const Text('重命名项目'),
                            content: TextField(
                              controller: nameController,
                              decoration: const InputDecoration(
                                hintText: '请输入新的项目名称',
                              ),
                            ),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Get.back();
                                },
                                child: const Text('取消'),
                              ),
                              TextButton(
                                onPressed: () {
                                  final newName = nameController.text;
                                  if (newName.isNotEmpty) {
                                    project.update((value) {
                                      value?.name = newName;
                                    });
                                  }
                                  Get.back();
                                },
                                child: const Text('确定'),
                              ),
                            ],
                          ),
                        );
                      } else if (value == 'delete') {
                        controller.projects.remove(project);
                        Get.back();
                      }
                    }
                  });
                },
                icon: Icon(Icons.more_vert_outlined))
          ],
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
                          var days =
                              ((value?.createdAt.microsecondsSinceEpoch ?? 0) /
                                      86400000000)
                                  .floor();
                          value?.offset = Offset(-days * xStep, 0);
                        });
                      },
                      icon: Icon(Icons.refresh_outlined),
                    ),
                    IconButton(
                        onPressed: () {
                          Get.dialog(
                            DatePickerDialog(
                              initialDate: DateTime.now(),
                              firstDate: DateTime(2000),
                              lastDate: DateTime(2100),
                            ),
                          ).then((selectedDate) {
                            if (selectedDate != null) {
                              // 当用户点击确定时，selectedDate 会是所选的日期
                              project.update((value) {
                                var days =
                                    ((selectedDate.microsecondsSinceEpoch) /
                                                86400000000)
                                            .floor() +
                                        1;
                                value?.offset = Offset(-days * xStep, 0);
                              });
                            }
                          });
                        },
                        icon: Icon(Icons.location_on_outlined))
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
      onLongPressDown: (details) {
        keyDownPosition.value = details.localPosition;
      },
      onLongPress: () {
        var newPlan = Plan(
            id: UuidV4().toString(),
            name: "",
            index: DateTime.now().millisecondsSinceEpoch);
        newPlan.position = Offset(
            ((keyDownPosition.value.dx - project.value.offset.dx) / xStep)
                .floorToDouble(),
            ((keyDownPosition.value.dy - project.value.offset.dy) / yStep)
                .floorToDouble());
        var obsPlan = newPlan.obs;
        project.value.addChild(obsPlan);
        Get.to(() => CardDetail(plan: obsPlan));
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
                () => CardDetail(
                  plan: child,
                ),
                transition: Transition.size,
              );
            },
            onPanUpdate: (details) {
              // 更新 child.position
              child.update((value) {
                value?.position += Offset(
                  details.delta.dx / kGridWidth,
                  details.delta.dy / kGridHeight,
                );
              });
            },
            onPanEnd: (details) {
              // 确保 position 是整数
              child.update((value) {
                value?.position = Offset(
                  value.position.dx.roundToDouble(),
                  value.position.dy.roundToDouble(),
                );
              });
            },
            onLongPress: () {
              Get.bottomSheet(CardBottomSheet());
            },
            child: Container(
              width: kGridWidth,
              height: kGridHeight,
              alignment: Alignment.center,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  color: Colors.grey[100],
                  border: Border.all(
                    color: Colors.black.withAlpha(128),
                    width: 1.5,
                  ),
                ),
                width: kGridWidth - 20,
                height: kGridHeight - 20,
                alignment: Alignment.center,
                padding: const EdgeInsets.all(8),
                child: Text(
                  child.value.name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ),
        ));
  }
}

class CardBottomSheet extends StatelessWidget {
  const CardBottomSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: const BorderRadius.vertical(
          top: Radius.circular(16),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: Icon(
              Icons.edit,
              color: Theme.of(context).colorScheme.primary,
            ),
            title: Text(
              '编辑',
              style: TextStyle(
                fontSize: 16,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            onTap: () {
              // 处理编辑操作
              Get.back();
            },
          ),
          const Divider(
            height: 1,
            thickness: 0.5,
          ),
          ListTile(
            leading: Icon(
              Icons.delete,
              color: Theme.of(context).colorScheme.error,
            ),
            title: Text(
              '删除',
              style: TextStyle(
                fontSize: 16,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            onTap: () {
              // 处理删除操作
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
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
      var value = offset.dx / kGridWidth;
      var dayOffset = value < 0 ? value.floor() + 1 : value.toInt() + 1;
      return Stack(
        children: [
          Positioned(
            left: (offset.dx % kGridWidth).roundToDouble() - kGridWidth,
            child: Row(
              children: List.generate(
                itemCount,
                (index) {
                  var current = DateTime.fromMillisecondsSinceEpoch(0)
                      .add(Duration(days: index - dayOffset));
                  // 计算 current 距离 1970 年 1 月 1 日的天数
                  var currentDaysSinceEpoch = current
                      .difference(DateTime.fromMillisecondsSinceEpoch(0))
                      .inDays;
                  // 计算当前日期距离 1970 年 1 月 1 日的天数
                  var nowDaysSinceEpoch = DateTime.now()
                      .difference(DateTime.fromMillisecondsSinceEpoch(0))
                      .inDays;
                  // 判断两个日期距离 1970 年的天数是否相同
                  var active = currentDaysSinceEpoch == nowDaysSinceEpoch;
                  return Container(
                    width: kGridWidth,
                    height: 56,
                    color: active
                        ? Colors.yellow.withAlpha(64)
                        : Colors.transparent,
                    alignment: Alignment.center,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          formatDate(current),
                          style: TextStyle(fontSize: 13), // 设置文本大小为中
                        ),
                        Text(
                          getWeekdayInfo(index, dayOffset),
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

class CardDetail extends StatelessWidget {
  final Rx<Plan> plan;

  static const double borderRadiusValue = 8;
  static const double borderWidth = 1.0;
  static const int hintTextAlpha = 64;

  const CardDetail({super.key, required this.plan});
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
                          leading: IconButton(
                            onPressed: () {
                              plan.update((value) {
                                value?.completed = !value.completed;
                              });
                            },
                            icon: Icon(plan.value.completed
                                ? Icons.check_circle_outline
                                : Icons.circle_outlined),
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
