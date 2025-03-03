import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/node.dart';

final double xStep = 120.0;
final double yStep = 80;

class DemoController extends GetxController {
  Rx<Plan> project = Plan(id: '1', name: '项目', index: 0).obs;

  DemoController() {
    var node1 = Plan(id: '2', name: '节点1', index: 1);
    node1.position = Offset(1, 1);
    var node2 = Plan(id: '3', name: '节点2', index: 2);

    node1.addNext(node2.obs);

    node2.position = Offset(3, 4);
    project.addChild(node1.obs);
    project.addChild(node2.obs);
  }
}

extension on Rx<Plan> {
  void addChild(Rx<Plan> obs) {
    value.addChild(obs);
  }
}

class DemoPage extends StatelessWidget {
  DemoPage({super.key});

  final controller = Get.put(DemoController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("例子"),
      ),
      body: GestureDetector(
        onPanUpdate: (details) {
          controller.project.update((value) {
            value?.offset += details.delta;
          });
        },
        child: Obx(() => CustomPaint(
              painter: GridBackground(),
              child: Container(
                  width: double.infinity,
                  height: double.infinity,
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: Colors.black,
                      width: 1,
                    ),
                  ),
                  child: Stack(
                    children: [
                      ...controller.project.value.children
                          .map((child) => DemoCard(plan: child)),
                    ],
                  )),
            )),
      ),
    );
  }
}

class DemoCard extends StatelessWidget {
  final Rx<Plan> plan;

  const DemoCard({
    super.key,
    required this.plan,
  });

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      var value = plan.value;
      var parent = plan.value.parent;
      return Positioned(
          left: value.position.dx * xStep + (parent?.offset.dx ?? 0),
          top: value.position.dy * yStep + (parent?.offset.dy ?? 0),
          child: GestureDetector(
            onPanUpdate: (details) => plan.update((value) {
              value?.position = Offset(
                value.position.dx + details.delta.dx / xStep,
                value.position.dy + details.delta.dy / yStep,
              );
            }),
            child: Container(
                width: xStep,
                height: yStep,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Colors.black,
                    width: 1,
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(value.name)),
          ));
    });
  }
}

class GridBackground extends CustomPainter {
  DemoController controller = Get.find<DemoController>();

  @override
  void paint(Canvas canvas, Size size) {
    Offset offset = controller.project.value.offset;

    final paint = Paint()
      ..color = Colors.black.withAlpha(64)
      ..style = PaintingStyle.stroke
      ..isAntiAlias = false
      ..strokeWidth = 1.0;

    for (double x = 0; x < size.width; x += xStep) {
      canvas.drawLine(Offset((x + offset.dx % xStep).roundToDouble(), 0),
          Offset((x + offset.dx % xStep).roundToDouble(), size.height), paint);
    }

    for (double y = 0; y < size.height; y += yStep) {
      canvas.drawLine(Offset(0, (y + offset.dy % yStep).roundToDouble()),
          Offset(size.width, (y + offset.dy % yStep).roundToDouble()), paint);
    }

    paint
      ..color = Colors.red
      ..isAntiAlias = true
      ..strokeWidth = 2.0;

    var children = controller.project.value.children;

    for (var child in children) {
      for (var next in child.value.nexts) {
        var from = child.value.position;
        var to = next.value.position;
        var controlPoint1 = Offset(
            (from.dx * xStep + offset.dx + xStep + to.dx * xStep + offset.dx) /
                2,
            from.dy * yStep + offset.dy + yStep / 2);
        var controlPoint2 = Offset(
            (from.dx * xStep + offset.dx + xStep + to.dx * xStep + offset.dx) /
                2,
            to.dy * yStep + offset.dy + yStep / 2);

        var path = Path()
          ..moveTo(from.dx * xStep + offset.dx + xStep,
              from.dy * yStep + offset.dy + yStep / 2)
          ..cubicTo(
              controlPoint1.dx,
              controlPoint1.dy,
              controlPoint2.dx,
              controlPoint2.dy,
              to.dx * xStep + offset.dx,
              to.dy * yStep + offset.dy + yStep / 2);

        canvas.drawPath(path, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}
