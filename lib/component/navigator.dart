import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/assets.dart';
import 'package:possible/model/node.dart';
import 'package:possible/page/backlog.dart';
import 'package:possible/page/demo.dart';
import 'package:possible/page/project.dart';
import 'package:possible/page/settings.dart';
import 'package:possible/page/test.dart';
import 'package:possible/page/today.dart';
import 'package:possible/state/state.dart';
import 'package:uuid/uuid.dart';

import 'icons.dart';

class NavigatorWidget extends StatelessWidget {
  const NavigatorWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(children: [
        NavHeaderList(),
        Divider(
          height: 1,
        ),
        NavBodyList(),
        Divider(
          height: 1,
        ),
        NavBottom(),
      ]),
    );
  }
}

class NavBottom extends StatelessWidget {
  const NavBottom({super.key});

  void showCreateDialog(BuildContext context) {
    var textController = TextEditingController();
    DataController controller = Get.find();

    void addProject(String projectName) {
      if (projectName.isNotEmpty) {
        var plan = Plan(
          id: Uuid().v4(),
          name: projectName,
          index: DateTime.now().millisecondsSinceEpoch,
        );
        controller.projects.add(plan.obs);
        Navigator.pop(context);
      }
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        title: const Text('新建项目'),
        content: TextField(
          controller: textController,
          autofocus: true,
          decoration: const InputDecoration(
            labelText: '项目名称',
            hintText: '请输入项目名称',
          ),
          onSubmitted: (value) => addProject(value),
        ),
        actions: [
          TextButton(
            onPressed: () => addProject(textController.text),
            child: const Text('确定'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: Row(
        children: [
          Expanded(
            child: InkWell(
              onTap: () => showCreateDialog(context),
              child: Container(
                height: 48,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  mainAxisSize: MainAxisSize.max,
                  children: const [
                    Icon(Icons.add),
                    SizedBox(width: 8),
                    Text(
                      '新建项目',
                    ),
                  ],
                ),
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: IconButton(
              onPressed: () {
                Get.to(() => SettingsPage());
              },
              icon: const Icon(Icons.settings),
            ),
          ),
        ],
      ),
    );
  }
}

class NavBodyList extends GetView<DataController> {
  const NavBodyList({super.key});

  @override
  Widget build(BuildContext context) {
    return Expanded(
        child: Obx(
      () => ReorderableListView.builder(
        shrinkWrap: true,
        padding: EdgeInsets.fromLTRB(10, 2, 10, 0),
        itemCount: controller.projects.length,
        proxyDecorator: (child, animation, direction) {
          return Container(
            margin: EdgeInsets.symmetric(vertical: 2),
            child: Material(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              color: Theme.of(context).colorScheme.surfaceContainerLow,
              child: child,
            ),
          );
        },
        itemBuilder: (context, index) {
          final project = controller.projects[index];
          return Obx(
              key: ValueKey(project.value.id),
              () => ReorderItem(
                    project: project.value,
                    key: ValueKey(project.value.id),
                  ));
        },
        onReorder: (int oldIndex, int newIndex) {
          var project = controller.projects.removeAt(oldIndex);
          controller.projects
              .insert(oldIndex <= newIndex ? newIndex - 1 : newIndex, project);
        },
      ),
    ));
  }
}

class ReorderItem extends StatelessWidget {
  const ReorderItem({
    super.key,
    required this.project,
    this.dragging = false,
  });

  final bool dragging;
  final Plan project;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: dragging ? 0 : 2),
      key: ValueKey(project.id),
      child: Material(
        key: ValueKey(project.id),
        elevation: dragging ? 2 : 0,
        color: Theme.of(context).colorScheme.surfaceContainerLow,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        child: ListTile(
          key: ValueKey(project.id),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          title: Text(
            project.name,
            overflow: TextOverflow.ellipsis,
          ),
          onTap: () {
            Get.offAll(() => ProjectPage(),
                arguments: {'id': project.id},
                transition: Transition.noTransition,
                duration: const Duration(milliseconds: 0));
          },
        ),
      ),
    );
  }
}

class NavHeaderList extends StatelessWidget {
  const NavHeaderList({super.key});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Theme.of(context).colorScheme.surfaceContainerLow,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(10, 8, 10, 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              leading: Iconify(MyIcons.sun),
              title: const Text('我的一天'),
              onTap: () {
                Get.offAll(() => TodayPage(),
                    transition: Transition.noTransition,
                    duration: const Duration(milliseconds: 0));
              },
            ),
            SizedBox(height: 4),
            ListTile(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              leading: Iconify(MyIcons.list),
              title: const Text('备忘录'),
              onTap: () {
                Get.offAll(() => BackLogPage(),
                    transition: Transition.noTransition,
                    duration: const Duration(milliseconds: 0));
              },
            ),
            SizedBox(height: 4),
            ListTile(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              leading: const Icon(Icons.star),
              title: const Text('测试'),
              onTap: () {
                Get.offAll(() => TestPage(),
                    transition: Transition.noTransition,
                    duration: const Duration(milliseconds: 0));
              },
            ),
            SizedBox(height: 4),
            ListTile(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              leading: const Icon(Icons.surfing),
              title: const Text('例子'),
              onTap: () {
                Get.offAll(() => DemoPage(),
                    transition: Transition.noTransition,
                    duration: const Duration(milliseconds: 0));
              },
            ),
          ],
        ),
      ),
    );
  }
}
