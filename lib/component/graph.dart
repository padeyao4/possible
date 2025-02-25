import 'package:flutter/material.dart';
import 'package:possible/component/icons.dart';
import 'package:possible/model/assets.dart';
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
                child: GraphHeader(offset: project.offset),
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
                  child: GraphRuler(offset: project.offset),
                ),
                Expanded(
                    child: GestureDetector(
                  onPanUpdate: (details) {
                    project.offset += details.delta;
                    context.read<MyState>().notify();
                  },
                  child: CustomPaint(
                      painter: GridPainter(
                          offset: project.offset, context: context),
                      child: Stack(
                        children: [
                          for (var child in project.children)
                            Positioned(
                              left: child.position.dx * 120 + project.offset.dx,
                              top: child.position.dy * 80 + project.offset.dy,
                              child: Container(
                                width: 120,
                                height: 80,
                                decoration: BoxDecoration(
                                  color: Theme.of(context)
                                      .colorScheme
                                      .primaryContainer,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Center(child: Text(child.name))
                              )
                            )
                        ]
                      )),
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
                      project.offset = Offset.zero;
                      context.read<MyState>().notify();
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
      final itemCount = (constraints.maxWidth / 120).ceil() + 2;
      var realValue = offset.dx / 120;
      var delta = realValue.toInt();
      delta = (realValue < 0 ? delta - 1 : delta);
      return Stack(
        children: [
          Positioned(
            left: (offset.dx % 120).roundToDouble() - 120,
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
      final itemCount = (constraints.maxHeight / 80).ceil() + 2;
      var realValue = offset.dy / 80;
      var delta = realValue.toInt();
      delta = (realValue < 0 ? delta - 1 : delta);
      return Stack(
        children: [
          Positioned(
            top: (offset.dy % 80).roundToDouble() - 80,
            child: Column(
              children: List.generate(
                itemCount,
                (index) => Container(
                  width: 40,
                  height: 80,
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

    const double xStep = 120.0;
    const double yStep = 80;

    for (double x = 0; x < size.width; x += xStep) {
      canvas.drawLine(
          Offset((x + offset.dx % xStep).roundToDouble(), 0),
          Offset((x + offset.dx % xStep).roundToDouble(), size.height),
          paint);
    }

    for (double y = 0; y < size.height; y += yStep) {
      canvas.drawLine(Offset(0, (y + offset.dy % yStep).roundToDouble()),
          Offset(size.width, (y + offset.dy % yStep).roundToDouble()), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}
