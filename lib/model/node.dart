import 'package:flutter/material.dart';
import 'package:get/get.dart';

class Plan {
  String id;
  String name;
  int index;
  Offset position = Offset.zero; // 位置坐标
  Offset offset = Offset.zero; // 显示窗口偏移
  Plan? parent;
  RxList<Plan> children = RxList<Plan>();
  RxList<Plan> pres = RxList<Plan>();
  RxList<Plan> nexts = RxList<Plan>();
  bool completed = false;

  Plan({required this.id, required this.name, required this.index});

  void addChild(Plan node) {
    node.parent = this;
    children.add(node);
  }
}
