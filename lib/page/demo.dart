import 'package:flutter/material.dart';

class Demo extends StatefulWidget {
  const Demo({super.key});

  @override
  State<Demo> createState() => _DemoState();
}

class _DemoState extends State<Demo> {
  Offset position = const Offset(100, 100);

  @override
  Widget build(BuildContext context) {
    var width = MediaQuery.of(context).size.width;
    var height = MediaQuery.of(context).size.height;
    // 获取父组件的尺寸
    var size = MediaQuery.of(context).size;
    debugPrint('width: $width, height: $height');
    debugPrint('size: $size');
    return Scaffold(
      body: GestureDetector(
        onPanUpdate: (details) {
          setState(() {
            position += details.delta;
          });
        },
        child: CustomPaint(
          painter: GridPainter(position: position),
          child: Container(
            width: width,
            height: height,
            decoration: BoxDecoration(
              border: Border.all(
                color: Colors.black,
                width: 1,
              ),
            ),
            child: Stack(
              alignment: Alignment.topLeft,
              children: [
                Positioned(
                  left: position.dx,
                  top: position.dy,
                  child: SizedBox(
                    width: 600,
                    height: 600,
                    child: Stack(
                      alignment: Alignment.topLeft,
                      children: [
                        Positioned(
                          left: 10,
                          top: 10,
                          child: Container(
                            width: 100,
                            height: 60,
                            decoration: BoxDecoration(
                              color: Theme.of(context).colorScheme.primaryContainer,
                              borderRadius: BorderRadius.circular(8),
                            )
                          ),
                        )
                      ]
                    ),
                  )
                )
              ],
            )
          ),
        ),
      ),
    );
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

// class TestDemoState extends State<Demo> {
//   Offset position = const Offset(100, 100);

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Stack(
//         children: [
//           Positioned(
//             left: position.dx,
//             top: position.dy,
//             child: GestureDetector(
//               onPanUpdate: (details) {
//                 setState(() {
//                   position += details.delta;
//                 });
//               },
//               child: Container(
//                 width: 600,
//                 height: 600,
//                 decoration: BoxDecoration(
//                   color: Theme.of(context).colorScheme.primary,
//                   borderRadius: BorderRadius.circular(8),
//                   boxShadow: [
//                     BoxShadow(
//                       color: Colors.black.withAlpha(64),
//                       blurRadius: 4,
//                       offset: const Offset(0, 2),
//                     ),
//                   ],
//                 ),
//                 child: Center(
//                   child: Text(
//                     '拖拽我',
//                     style: TextStyle(
//                       color: Theme.of(context).colorScheme.onPrimary,
//                     ),
//                   ),
//                 ),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
