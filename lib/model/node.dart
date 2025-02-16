class Node {
  String id;
  String name;
  int index;
  Point position;
  Node? parent;
  List<Node> children = [];
  List<Node> pres = [];
  List<Node> nexts = [];

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
