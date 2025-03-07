import 'package:flutter/material.dart';
import 'package:get/state_manager.dart';
import 'package:possible/model/node.dart';

/// 数据控制器，负责管理应用程序的状态
class DataController extends GetxController {
  /// 项目列表，使用RxList包装以实现响应式
  final projects = RxList<Rx<Plan>>();

  /// 待办事项列表，使用RxList包装以实现响应式
  final backlogs = RxList<Rx<Plan>>();

  /// Scaffold的全局key，用于控制抽屉的开关
  final scaffoldKey = GlobalKey<ScaffoldState>();

  /// 详情面板的开关状态
  final isDetailOpen = false.obs;

  /// 清空所有数据
  void cleanAll() {
    projects.clear();
    backlogs.clear();
    update(); // 通知UI更新
  }

  /// 打开详情面板
  void openDetail() {
    isDetailOpen.value = true;
    scaffoldKey.currentState?.openEndDrawer();
  }

  /// 关闭详情面板
  void closeDetail() {
    isDetailOpen.value = false;
    scaffoldKey.currentState?.closeEndDrawer();
  }

  /// 更新待办事项
  /// [plan] 需要更新的计划对象
  void updateBacklog(Plan plan) {
    var index = backlogs.indexWhere((element) => element.value.id == plan.id);
    if (index != -1) {
      backlogs[index].value = plan;
      backlogs[index].refresh(); // 刷新单个对象的状态
    }
  }

  /// 切换详情面板的显示状态
  void changeDetailState() {
    if (scaffoldKey.currentState != null) {
      // 根据当前抽屉状态执行相应操作
      if (scaffoldKey.currentState!.isEndDrawerOpen) {
        scaffoldKey.currentState!.closeEndDrawer();
      } else {
        scaffoldKey.currentState!.openEndDrawer();
      }
      isDetailOpen.value = scaffoldKey.currentState!.isEndDrawerOpen;
    } else {
      // 如果scaffoldState为空，仅切换状态值
      isDetailOpen.value = !isDetailOpen.value;
    }
  }
}
