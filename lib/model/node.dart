import 'package:flutter/material.dart';

class Node {
  String id;
  String name;
  int index;
  Offset position = Offset.zero; // 位置坐标
  Offset offset = Offset.zero; // 显示窗口偏移
  Node? parent;
  List<Node> children = [];
  List<Node> pres = [];
  List<Node> nexts = [];
  bool completed = false;

  Node({required this.id, required this.name, required this.index});

  void addChild(Node node) {
    node.parent = this;
    children.add(node);
  }
}
