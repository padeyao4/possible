import 'package:flutter/material.dart';
import 'package:get/state_manager.dart';
import 'package:possible/model/assets.dart';
import 'package:possible/model/node.dart';

class DataController extends GetxController {
  final projects = <Rx<Plan>>[].obs;
  final backlogs = <Rx<Plan>>[].obs;

  void cleanAll() {
    projects.clear();
    backlogs.clear();
  }
}

class MyState extends ChangeNotifier {
  MyPage page = MyPage.today;
  List<Plan> projects = [];
  List<Plan> backlogs = [];
  Plan? current;

  void setProjectPage(Plan node) {
    current = node;
    page = MyPage.project;
    notifyListeners();
  }

  void setBacklogCompleted(Plan node) {
    node.completed = !node.completed;
    notifyListeners();
  }

  void addBacklog(Plan node) {
    backlogs.add(node);
    notifyListeners();
  }

  void changePage(MyPage page) {
    this.page = page;
    notifyListeners();
  }

  void addProject(Plan node) {
    projects.add(node);
    notifyListeners();
  }

  void removeProject(Plan node) {
    projects.remove(node);
    notifyListeners();
  }

  void cleanProjects() {
    projects.clear();
    notifyListeners();
  }

  void cleanBacklogs() {
    backlogs.clear();
    notifyListeners();
  }

  void setCurrent(Plan node) {
    current = node;
    notifyListeners();
  }

  void notify() {
    notifyListeners();
  }

  void swapProject(int oldIndex, int newIndex) {
    if (oldIndex <= newIndex) {
      newIndex = newIndex - 1;
    }
    var project = projects.removeAt(oldIndex);
    projects.insert(newIndex, project);
    notifyListeners();
  }
}
