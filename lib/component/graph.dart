import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/component/icons.dart';

import '../model/assets.dart';
import '../model/node.dart';

const double kGridWidth = 120.0;
const double kGridHeight = 80.0;

class GraphWidget extends StatelessWidget {
  final Rx<Plan> project;
  const GraphWidget({
    super.key,
    required this.project,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                child: Icon(Icons.lock),
              ),
              Expanded(
                  child: Container(
                height: 40,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.secondaryContainer,
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
                    color: Theme.of(context).colorScheme.secondaryContainer,
                  ),
                  child: Obx(() => GraphRuler(offset: project.value.offset)),
                ),
                Expanded(
                    child: Obx(() => GestureDetector(
                          onPanUpdate: (details) {
                            project.value.offset += details.delta;
                          },
                          child: CustomPaint(
                              painter: GridPainter(
                                  offset: project.value.offset,
                                  context: context),
                              child: Obx(() => (Stack(children: [
                                    for (var child in project.value.children)
                                      Positioned(
                                          left: child.position.dx * kGridWidth +
                                              project.value.offset.dx,
                                          top: child.position.dy * kGridHeight +
                                              project.value.offset.dy,
                                          child: GestureDetector(
                                              onTap: () {
                                                debugPrint('hello');
                                              },
                                              onPanUpdate: (details) {
                                                // 更新 child.position
                                                child.position += Offset(
                                                    details.delta.dx /
                                                        kGridWidth,
                                                    details.delta.dy /
                                                        kGridHeight);
                                              },
                                              onPanEnd: (details) {
                                                // 确保 position 是整数
                                                child.position = Offset(
                                                    child.position.dx
                                                        .roundToDouble(),
                                                    child.position.dy
                                                        .roundToDouble());
                                              },
                                              child: Container(
                                                  width: kGridWidth,
                                                  height: kGridHeight,
                                                  decoration: BoxDecoration(
                                                    color: Theme.of(context)
                                                        .colorScheme
                                                        .primaryContainer,
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            8),
                                                  ),
                                                  child: Center(
                                                      child:
                                                          Text(child.name))))),
                                  ])))),
                        ))),
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
                      project.value.offset = Offset.zero;
                      // context.read<MyState>().notify();
                    },
                    icon: Iconify(MyIcons.home),
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
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
      delta = (realValue < 0 ? delta - 1 : delta);
      return Stack(
        children: [
          Positioned(
            left: (offset.dx % kGridWidth).roundToDouble() - kGridWidth,
            child: Row(
              children: List.generate(
                itemCount,
                (index) {
                  return Container(
                    decoration: BoxDecoration(
                        border:
                            Border(right: BorderSide(color: Colors.black12))),
                    width: kGridWidth,
                    height: 40,
                    alignment: Alignment.center,
                    child: Text(
                      (index - delta).toString(),
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

class GridPainter extends CustomPainter {
  Offset offset;
  BuildContext context;

  GridPainter({required this.offset, required this.context});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Theme.of(context).dividerColor.withAlpha(64)
      ..style = PaintingStyle.stroke
      ..isAntiAlias = false
      ..strokeWidth = 1;

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
