import 'package:flutter/material.dart';
import 'package:possible/model/content.dart';
import 'package:possible/model/node.dart';

class MyState extends ChangeNotifier {
  MyPage page = MyPage.home;
  List<Node> projects = [];
  List<Node> backlogs = [];
  Node? current;

  void setProjectPage(Node node) {
    current = node;
    page = MyPage.project;
    notifyListeners();
  }

  void updateBacklogComplated(Node node) {
    node.completed = !node.completed;
    notifyListeners();
  }

  void addBacklog(Node node) {
    backlogs.add(node);
    notifyListeners();
  }

  void changePage(MyPage page) {
    this.page = page;
    notifyListeners();
  }

  void addProject(Node node) {
    projects.add(node);
    notifyListeners();
  }

  void removeProject(Node node) {
    projects.remove(node);
    notifyListeners();
  }

  void cleanProjects() {
    projects.clear();
    notifyListeners();
  }

  void setCurrent(Node node) {
    current = node;
    notifyListeners();
  }
}
