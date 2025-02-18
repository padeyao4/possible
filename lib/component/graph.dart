import 'package:flutter/material.dart';
import 'package:iconify_flutter/iconify_flutter.dart';
import 'package:possible/model/content.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

class GraphWidget extends StatelessWidget {
  final Node project;

  const GraphWidget({
    super.key,
    required this.project,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.transparent,
              ),
              child: Icon(Icons.lock),
            ),
            Expanded(
                child: Container(
              height: 40,
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: GraphHeader(position: project.position),
            ))
          ],
        ),
        Expanded(
          child: Row(
            children: [
              Container(
                width: 40,
                decoration: BoxDecoration(
                  color: Colors.brown,
                ),
                child: GraphRuler(position: project.position),
              ),
              Expanded(
                  child: GestureDetector(
                onPanUpdate: (details) {
                  project.position += details.delta;
                  context.read<MyState>().notify();
                },
                child: CustomPaint(
                    painter: GridPainter(position: project.position),
                    child: Container()),
              )),
            ],
          ),
        ),
        Container(
          height: 48,
          decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey.shade300))),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                  style: ButtonStyle(),
                  onPressed: () {
                    project.position = Offset.zero;
                    context.read<MyState>().notify();
                  },
                  icon: Iconify(MyIcons.home))
            ],
          ),
        ),
      ],
    );
  }
}

class GraphHeader extends StatelessWidget {
  final Offset position;

  const GraphHeader({super.key, required this.position});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final itemCount = (constraints.maxWidth / 120).ceil() + 2;
      var realValue = position.dx / 120;
      var delta = realValue.toInt();
      delta = (realValue < 0 ? delta - 1 : delta);
      return Stack(
        children: [
          Positioned(
            left: (position.dx % 120).roundToDouble() - 120,
            child: Row(
              children: List.generate(
                itemCount,
                (index) {
                  return Container(
                    decoration: BoxDecoration(
                        border:
                            Border(right: BorderSide(color: Colors.black12))),
                    width: 120,
                    height: 40,
                    alignment: Alignment.center,
                    child: Text(
                      (index - delta).toString(),
                      style: const TextStyle(color: Colors.white),
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
  final Offset position;
  const GraphRuler({super.key, required this.position});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final itemCount = (constraints.maxHeight / 80).ceil() + 2;
      var realValue = position.dy / 80;
      var delta = realValue.toInt();
      delta = (realValue < 0 ? delta - 1 : delta);
      return Stack(
        children: [
          Positioned(
            top: (position.dy % 80).roundToDouble() - 80,
            child: Column(
              children: List.generate(
                itemCount,
                (index) => Container(
                  width: 40,
                  height: 80,
                  alignment: Alignment.center,
                  child: Text(
                    (index - delta).toString(),
                    style: const TextStyle(color: Colors.white),
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
  Offset position;

  GridPainter({required this.position});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black.withAlpha(64)
      ..style = PaintingStyle.stroke
      ..isAntiAlias = false
      ..strokeWidth = 1.0;

    const double xStep = 120.0;
    const double yStep = 80;

    for (double x = 0; x < size.width; x += xStep) {
      canvas.drawLine(
          Offset((x + position.dx % xStep).roundToDouble(), 0),
          Offset((x + position.dx % xStep).roundToDouble(), size.height),
          paint);
    }

    for (double y = 0; y < size.height; y += yStep) {
      canvas.drawLine(Offset(0, (y + position.dy % yStep).roundToDouble()),
          Offset(size.width, (y + position.dy % yStep).roundToDouble()), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}
