import 'package:flutter/material.dart';
import 'package:get/get.dart';

class Plan {
  String id;
  String name;
  int index;
  Offset position = Offset.zero; // 位置坐标
  Offset offset = Offset.zero; // 显示窗口偏移
  Plan? parent;
  RxList<Rx<Plan>> children = RxList();
  RxList<Rx<Plan>> pres = RxList();
  RxList<Rx<Plan>> nexts = RxList();
  bool completed;

  Plan(
      {required this.id,
      required this.name,
      required this.index,
      this.completed = false});

  void addChild(Rx<Plan> node) {
    node.value.parent = this;
    children.add(node);
  }
}
