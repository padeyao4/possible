class Node {
  String id;
  String name;
  int index;
  Point position;
  Node? parent;
  List<Node> children = [];
  List<Node> pres = [];
  List<Node> nexts = [];
  bool completed = false;

  Node(
      {required this.id,
      required this.name,
      required this.index,
      required this.position});
}

class Point {
  double x;
  double y;

  Point(this.x, this.y);
}
