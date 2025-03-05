import 'package:flutter/material.dart';
import 'package:get/get.dart';

class Plan {
  String id;
  String name;
  int index;
  Offset position = Offset.zero; // 位置坐标
  Offset offset = Offset.zero; // 显示窗口偏移
  Plan? parent;
  DateTime createdAt = DateTime.now(); // 添加创建时间属性
  RxList<Rx<Plan>> children = RxList();
  RxList<Rx<Plan>> pres = RxList();
  RxList<Rx<Plan>> nexts = RxList();
  bool completed;
  String? note; // 添加备注属性

  Plan(
      {required this.id,
      required this.name,
      required this.index,
      this.completed = false});

  void addChild(Rx<Plan> node) {
    node.value.parent = this;
    children.add(node);
  }

  void addNext(Rx<Plan> obs) {
    nexts.add(obs);
    obs.value.pres.add(this.obs);
  }

  void removeChild(Rx<Plan> plan) {
    children.remove(plan);
  }
}
