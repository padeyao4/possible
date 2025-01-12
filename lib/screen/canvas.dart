import 'package:flutter/material.dart';
import '../node.dart';

class ResizableWidget extends StatefulWidget {
  final Node node;
  final Widget child;
  final Color color;
  final Function(Node) onResize;

  const ResizableWidget({
    super.key,
    required this.node,
    required this.child,
    required this.color,
    required this.onResize,
  });

  @override
  ResizableWidgetState createState() => ResizableWidgetState();
}

class ResizableWidgetState extends State<ResizableWidget> {
  // 调整大小的触控区域大小
  static const double _handleSize = 10.0;

  // 记录当前正在调整的方向
  bool _resizingRight = false;
  bool _resizingBottom = false;
  bool _resizingLeft = false;
  bool _resizingTop = false;

  // 新增角落调整标志
  bool _resizingTopLeft = false;
  bool _resizingTopRight = false;
  bool _resizingBottomLeft = false;
  bool _resizingBottomRight = false;

  void _updateSize(DragUpdateDetails details) {
    setState(() {
      // 边缘调整
      if (_resizingRight) {
        widget.node.dragRight(details.delta.dx.toInt());
      }
      if (_resizingBottom) {
        widget.node.dragBottom(details.delta.dy.toInt());
      }
      if (_resizingLeft) {
        widget.node.dragLeft(details.delta.dx.toInt());
      }
      if (_resizingTop) {
        widget.node.dragTop(details.delta.dy.toInt());
      }

      // 角落调整
      if (_resizingTopLeft) {
        widget.node.dragLeft(details.delta.dx.toInt());
        widget.node.dragTop(details.delta.dy.toInt());
      }
      if (_resizingTopRight) {
        widget.node.dragRight(details.delta.dx.toInt());
        widget.node.dragTop(details.delta.dy.toInt());
      }
      if (_resizingBottomLeft) {
        widget.node.dragLeft(details.delta.dx.toInt());
        widget.node.dragBottom(details.delta.dy.toInt());
      }
      if (_resizingBottomRight) {
        widget.node.dragRight(details.delta.dx.toInt());
        widget.node.dragBottom(details.delta.dy.toInt());
      }

      // 调用回调函数通知父组件大小变化
      widget.onResize(widget.node);
    });
  }

  // 角落调整手柄的通用构建方法
  Widget _buildCornerHandle({
    required AlignmentGeometry alignment,
    required void Function() onPanStart,
    required void Function() onPanEnd,
  }) {
    return Positioned.fill(
      child: Align(
        alignment: alignment,
        child: GestureDetector(
          onPanStart: (_) => onPanStart(),
          onPanUpdate: _updateSize,
          onPanEnd: (_) => onPanEnd(),
          child: Container(
            width: _handleSize,
            height: _handleSize,
            color: Colors.transparent,
            child: Center(
              child: Container(
                width: 4,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.withOpacity(0.5),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.node.w.toDouble() + _handleSize * 2,
      height: widget.node.h.toDouble() + _handleSize * 2,
      child: Stack(
        children: [
          // 主内容
          Positioned(
            left: _handleSize,
            top: _handleSize,
            child: Container(
              width: widget.node.w.toDouble(),
              height: widget.node.h.toDouble(),
              color: widget.color,
              child: widget.child,
            ),
          ),

          // 右边缘调整手柄
          Positioned(
            right: 0,
            top: _handleSize,
            bottom: _handleSize,
            child: GestureDetector(
              onPanStart: (_) => _resizingRight = true,
              onPanUpdate: _updateSize,
              onPanEnd: (_) => _resizingRight = false,
              child: Container(
                width: _handleSize,
                color: Colors.transparent,
                child: Center(
                  child: Container(
                    width: 2,
                    color: Colors.grey.withOpacity(0.5),
                  ),
                ),
              ),
            ),
          ),

          // 底部边缘调整手柄
          Positioned(
            bottom: 0,
            left: _handleSize,
            right: _handleSize,
            child: GestureDetector(
              onPanStart: (_) => _resizingBottom = true,
              onPanUpdate: _updateSize,
              onPanEnd: (_) => _resizingBottom = false,
              child: Container(
                height: _handleSize,
                color: Colors.transparent,
                child: Center(
                  child: Container(
                    height: 2,
                    color: Colors.grey.withOpacity(0.5),
                  ),
                ),
              ),
            ),
          ),

          // 左边缘调整手柄
          Positioned(
            left: 0,
            top: _handleSize,
            bottom: _handleSize,
            child: GestureDetector(
              onPanStart: (_) => _resizingLeft = true,
              onPanUpdate: _updateSize,
              onPanEnd: (_) => _resizingLeft = false,
              child: Container(
                width: _handleSize,
                color: Colors.transparent,
                child: Center(
                  child: Container(
                    width: 2,
                    color: Colors.grey.withOpacity(0.5),
                  ),
                ),
              ),
            ),
          ),

          // 顶部边缘调整手柄
          Positioned(
            top: 0,
            left: _handleSize,
            right: _handleSize,
            child: GestureDetector(
              onPanStart: (_) => _resizingTop = true,
              onPanUpdate: _updateSize,
              onPanEnd: (_) => _resizingTop = false,
              child: Container(
                height: _handleSize,
                color: Colors.transparent,
                child: Center(
                  child: Container(
                    height: 2,
                    color: Colors.grey.withOpacity(0.5),
                  ),
                ),
              ),
            ),
          ),

          // 四个角落调整手柄
          _buildCornerHandle(
            alignment: Alignment.topLeft,
            onPanStart: () => _resizingTopLeft = true,
            onPanEnd: () => _resizingTopLeft = false,
          ),
          _buildCornerHandle(
            alignment: Alignment.topRight,
            onPanStart: () => _resizingTopRight = true,
            onPanEnd: () => _resizingTopRight = false,
          ),
          _buildCornerHandle(
            alignment: Alignment.bottomLeft,
            onPanStart: () => _resizingBottomLeft = true,
            onPanEnd: () => _resizingBottomLeft = false,
          ),
          _buildCornerHandle(
            alignment: Alignment.bottomRight,
            onPanStart: () => _resizingBottomRight = true,
            onPanEnd: () => _resizingBottomRight = false,
          ),
        ],
      ),
    );
  }
}

class Canvas extends StatefulWidget {
  const Canvas({super.key});

  @override
  CanvasState createState() => CanvasState();
}

class CanvasState extends State<Canvas> {
  late Node randomNode;
  Color _nodeColor = Colors.blue;

  void _regenerateNode() {
    setState(() {
      randomNode = Node.generateRandomNode();
      _nodeColor = Colors.blue; // 重置颜色
    });
  }

  @override
  void initState() {
    super.initState();
    randomNode = Node.generateRandomNode();
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: const Text('可交互节点'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _regenerateNode,
            tooltip: '重新生成节点',
          ),
        ],
      ),
      body: GestureDetector(
        onPanUpdate: (details) {
          setState(() {
            // 限制节点在屏幕范围内
            randomNode.x += details.delta.dx.toInt();
            randomNode.y += details.delta.dy.toInt();

            // 确保节点不会超出屏幕边界
            randomNode.x = randomNode.x
                .clamp(0, (screenSize.width - randomNode.w).toInt());
            randomNode.y = randomNode.y.clamp(
                0, (screenSize.height - randomNode.h - kToolbarHeight).toInt());
          });
        },
        child: Stack(
          children: [
            Positioned(
              left: randomNode.x.toDouble(),
              top: randomNode.y.toDouble(),
              child: ResizableWidget(
                node: randomNode,
                color: _nodeColor,
                onResize: (updatedNode) {
                  setState(() {
                    // 这里可以添加额外的大小调整逻辑
                  });
                },
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      // 点击时随机改变节点颜色
                      _nodeColor = Colors.primaries[
                          DateTime.now().millisecondsSinceEpoch %
                              Colors.primaries.length];
                    });
                  },
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          randomNode.name,
                          style: const TextStyle(
                              color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '拖拽或点击我',
                          style: TextStyle(
                              color: Colors.white.withOpacity(0.7),
                              fontSize: 10),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
