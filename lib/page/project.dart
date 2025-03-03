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
                SizedBox(
                  width: 40,
                  height: 40,
                  child: Transform.scale(
                    scale: 0.8, // 可以调整此值来改变图标大小
                    child: Icon(Icons.lock_open_outlined),
                  ),
                ),
                Expanded(
                    child: Container(
                  height: 40,
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
                    width: 40,
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

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final itemCount = (constraints.maxWidth / kGridWidth).ceil() + 2;
      var realValue = offset.dx / kGridWidth;
      var delta = realValue.toInt();
      delta = (realValue < 0 ? delta - 1 : delta) + 1;
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
                    height: 40,
                    alignment: Alignment.center,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          () {
                            // 计算从1970年1月1日开始的日期
                            final date = DateTime.fromMillisecondsSinceEpoch(0)
                                .add(Duration(days: index - delta));
                            // 格式化日期
                            final formattedDate =
                                '${date.year}/${date.month.toString().padLeft(2, '0')}/${date.day.toString().padLeft(2, '0')}';
                            return formattedDate;
                          }(),
                        ),
                        Text(
                          () {
                            final date = DateTime.fromMillisecondsSinceEpoch(0)
                                .add(Duration(days: index - delta));
                            final n = index - delta;
                            return '星期${date.weekday} ${n}';
                          }(),
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
      var delta = realValue.toInt();
      delta = (realValue < 0 ? delta - 1 : delta);
      return Stack(
        children: [
          Positioned(
            top: (offset.dy % kGridHeight).roundToDouble() - kGridHeight,
            child: Column(
              children: List.generate(
                itemCount,
                (index) => Container(
                  width: 40,
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
    final paint = Paint()
      ..color = Theme.of(context).dividerColor.withAlpha(64)
      ..style = PaintingStyle.stroke
      ..isAntiAlias = false
      ..strokeWidth = 1;

    canvas.drawLine(Offset.zero, Offset(0, size.height), paint);
    canvas.drawLine(Offset.zero, Offset(size.width, 0), paint);

    for (double x = 0; x < size.width; x += kGridWidth) {
      canvas.drawLine(
          Offset((x + offset.dx % kGridWidth).roundToDouble(), 0),
          Offset((x + offset.dx % kGridWidth).roundToDouble(), size.height),
          paint);
    }

    for (double y = 0; y < size.height; y += kGridHeight) {
      canvas.drawLine(
          Offset(0, (y + offset.dy % kGridHeight).roundToDouble()),
          Offset(size.width, (y + offset.dy % kGridHeight).roundToDouble()),
          paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}
