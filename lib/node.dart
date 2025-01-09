import 'dart:math';

class Node {
  final String id;
  final String name;
  Node? parent;
  int x;
  int y;
  int w;
  int h;
  final List<Node> children;
  final List<Node> prevs;
  final List<Node> nexts;

  Node(
      {required this.id,
      required this.name,
      required this.parent,
      required this.children,
      required this.prevs,
      required this.nexts,
      required this.x,
      required this.y,
      required this.w,
      required this.h});

  static Node generateRandomNode() {
    final random = Random();
    final Node selfParent = Node(
        id: 'parent_${DateTime.now().millisecondsSinceEpoch}',
        name: '根节点',
        parent: null,
        children: [],
        prevs: [],
        nexts: [],
        x: 0,
        y: 0,
        w: 0,
        h: 0);

    return Node(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: '随机节点 ${random.nextInt(1000)}',
        parent: selfParent,
        children: [],
        prevs: [],
        nexts: [],
        x: random.nextInt(500),
        y: random.nextInt(500),
        w: random.nextInt(100) + 50,
        h: random.nextInt(100) + 50);
  }

  get left => x;

  get top => y;

  get right => x + w;

  get bottom => y + h;

  void dragLeft(int dx) {
    x = x + dx;
    w = w - dx;
  }

  void dragTop(int dy) {
    y = y + dy;
    h = h - dy;
  }

  void dragRight(int dx) {
    w = w + dx;
  }

  void dragBottom(int dy) {
    h = h + dy;
  }

  void addChild(Node child) {
    children.add(child);
    child.parent = this;
  }

  void addPrev(Node prev) {
    prevs.add(prev);
    prev.nexts.add(this);
  }

  void addNext(Node next) {
    nexts.add(next);
    next.prevs.add(this);
  }

  void removeChild(Node child) {
    children.remove(child);
    child.parent = null;
  }
}
