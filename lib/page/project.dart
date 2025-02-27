import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/component/graph.dart';
import 'package:possible/component/layout.dart';
import 'package:possible/state/state.dart';

class ProjectPage extends GetView<DataController> {
  const ProjectPage({super.key});

  @override
  Widget build(BuildContext context) {
    DataController controller = Get.find();
    var projects = controller.projects
        .where((element) => element.value.id == Get.arguments['id'])
        .toList();
    return DefaultLayout(
        title: projects[0].value.name,
        child: GraphWidget(project: projects[0]));
  }
}
