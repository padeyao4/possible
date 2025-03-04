import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';

class ProjectPage extends GetView<DataController> {
  const ProjectPage({super.key});

  @override
  Widget build(BuildContext context) {
    // 获取传递过来的项目对象
    final project = Get.arguments as Rx<Plan>;

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
                  Expanded(
                      child: GestureDetector(
                    onPanUpdate: (details) {
                      project.update((value) {
                        value?.offset += details.delta;
                        if (value?.offset.dy != null && value!.offset.dy > 0) {
                          value.offset = Offset(value.offset.dx, 0);
                        }
                      });
                    },
                    child: Obx(() => Stack(children: [
                          CustomPaint(
                            painter: GridBackground(
                                offset: project.value.offset, context: context),
                            child: Stack(children: [
                              for (var child in project.value.children)
                                PlanCard(child: child),
                            ]),
                          ),
                        ])),
                  )),
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
              debugPrint('hello');
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
      // delta = (realValue < 0 ? delta - 1 : delta) + 1;
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
      if (round % 7 == 2) {
        final rect = Rect.fromLTWH(rx, 0, 2 * kGridWidth, size.height);
        canvas.drawRect(rect, rectPaint);
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
