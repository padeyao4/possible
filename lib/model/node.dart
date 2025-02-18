import 'package:flutter/material.dart';

class Node {
  String id;
  String name;
  int index;
  Offset position = Offset.zero;
  Node? parent;
  List<Node> children = [];
  List<Node> pres = [];
  List<Node> nexts = [];
  bool completed = false;

  Node({required this.id, required this.name, required this.index});
}
