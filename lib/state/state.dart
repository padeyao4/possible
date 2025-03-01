import 'package:flutter/material.dart';
import 'package:get/state_manager.dart';
import 'package:possible/model/node.dart';

class DataController extends GetxController {
  final projects = RxList<Rx<Plan>>();
  final backlogs = RxList<Rx<Plan>>();
  var scaffoldKey = GlobalKey<ScaffoldState>();
  var isDetailOpen = false.obs;

  void cleanAll() {
    projects.clear();
    backlogs.clear();
    update();
  }

  void openDetail() {
    isDetailOpen.value = true;
    scaffoldKey.currentState?.openEndDrawer();
  }

  void closeDetail() {
    isDetailOpen.value = false;
    scaffoldKey.currentState?.closeEndDrawer();
  }

  void changeDetailState() {
    if (scaffoldKey.currentState != null) {
      scaffoldKey.currentState!.isEndDrawerOpen
          ? scaffoldKey.currentState!.closeEndDrawer()
          : scaffoldKey.currentState!.openEndDrawer();
      isDetailOpen.value = scaffoldKey.currentState!.isEndDrawerOpen;
    } else {
      isDetailOpen.value = !isDetailOpen.value;
    }
  }
}
