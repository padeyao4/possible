import 'package:flutter/material.dart';

class Plan {
  String id;
  String name;
  int index;
  Offset position = Offset.zero; // 位置坐标
  Offset offset = Offset.zero; // 显示窗口偏移
  Plan? parent;
  List<Plan> children = [];
  List<Plan> pres = [];
  List<Plan> nexts = [];
  bool completed = false;

  Plan({required this.id, required this.name, required this.index});

  void addChild(Plan node) {
    node.parent = this;
    children.add(node);
  }
}
