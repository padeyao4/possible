import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/assets.dart';
import 'package:possible/model/node.dart' as model;
import 'package:possible/page/backlog.dart';
import 'package:possible/page/demo.dart';
import 'package:possible/page/test.dart';
import 'package:possible/page/today.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';

import 'icons.dart';

class NavigatorWidget extends StatelessWidget {
  const NavigatorWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        color: Theme.of(context).colorScheme.surfaceContainerLow,
        child: Column(children: [
          NavHeaderList(),
          Divider(
            height: 1,
            thickness: 0.5,
            color: Theme.of(context).dividerColor,
          ),
          NavBodyList(),
          Divider(
            height: 1,
            thickness: 0.5,
            color: Theme.of(context).dividerColor,
          ),
          NavBottom(),
        ]),
      ),
    );
  }
}

class NavBottom extends StatelessWidget {
  const NavBottom({super.key});

  void showCreateDialog(BuildContext context) {
    var textController = TextEditingController();

    void addProject(String projectName) {
      if (projectName.isNotEmpty) {
        context.read<MyState>().addProject(model.Plan(
              id: Uuid().v4(),
              name: projectName,
              index: DateTime.now().millisecondsSinceEpoch,
            ));
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
              onPressed: () {},
              icon: const Icon(Icons.settings),
            ),
          ),
        ],
      ),
    );
  }
}

class NavBodyList extends StatelessWidget {
  const NavBodyList({super.key});

  @override
  Widget build(BuildContext context) {
    var projects = context.watch<MyState>().projects;
    return Expanded(
      child: ReorderableListView.builder(
        shrinkWrap: true,
        padding: EdgeInsets.fromLTRB(10, 2, 10, 0),
        itemCount: projects.length,
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
          final project = projects[index];
          return ReorderItem(
            project: project,
            key: ValueKey(project.id),
          );
        },
        onReorder: (int oldIndex, int newIndex) {
          context.read<MyState>().swapProject(oldIndex, newIndex);
        },
      ),
    );
  }
}

class ReorderItem extends StatelessWidget {
  const ReorderItem({
    super.key,
    required this.project,
    this.dragging = false,
  });

  final bool dragging;
  final model.Plan project;

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
            context.read<MyState>().setProjectPage(project);
            Scaffold.of(context).closeDrawer();
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
                    transition: Transition.noTransition);
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
                    transition: Transition.noTransition);
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
                    transition: Transition.noTransition);
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
                    transition: Transition.noTransition);
              },
            ),
          ],
        ),
      ),
    );
  }
}
