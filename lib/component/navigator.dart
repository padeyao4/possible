import 'package:flutter/material.dart';
import 'package:possible/model/content.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

class NavigatorWidget extends StatelessWidget {
  const NavigatorWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      width: 240,
      child: Column(children: [
        NavHeaderList(),
        NavBodyList(),
        NavBottom(),
      ]),
    );
  }
}

class NavBottom extends StatelessWidget {
  const NavBottom({super.key});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: const Icon(Icons.add),
      title: const Text('新建项目'),
      onTap: () {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('新建项目'),
            content: TextField(
              autofocus: true,
              decoration: const InputDecoration(
                labelText: '项目名称',
                hintText: '请输入项目名称',
              ),
              onSubmitted: (value) {
                if (value.isNotEmpty) {
                  context.read<MyState>().addProject(Node(
                      id: value,
                      name: value,
                      index: DateTime.now().millisecondsSinceEpoch,
                      position: Point(0, 0))); // 使用 Offset 替代 Point
                  Navigator.pop(context);
                }
              },
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('取消'),
              ),
            ],
          ),
        );
      },
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
        itemBuilder: (context, index) {
          var project = projects[index];
          return ListTile(
            key: ValueKey(project.id),
            title: Text(project.name),
            onTap: () {
              context.read<MyState>().setProjectPage(project);
              Scaffold.of(context).closeDrawer();
            },
          );
        },
        itemCount: projects.length,
        onReorder: (oldIndex, newIndex) {
          if (newIndex > oldIndex) {
            newIndex -= 1;
          }
          final Node item = projects.removeAt(oldIndex);
          projects.insert(newIndex, item);
        },
      ),
    );
  }
}

class NavHeaderList extends StatelessWidget {
  const NavHeaderList({super.key});

  @override
  Widget build(BuildContext context) {
    return DrawerHeader(
        padding: EdgeInsets.zero,
        child: ListView(
          padding: EdgeInsets.zero,
          shrinkWrap: true,
          children: [
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text('我的一天'),
              onTap: () {
                context.read<MyState>().changePage(MyPage.home);
                Scaffold.of(context).closeDrawer();
              },
            ),
            ListTile(
              leading: const Icon(Icons.note),
              title: const Text('备忘录'),
              onTap: () {
                context.read<MyState>().changePage(MyPage.backLog);
                Scaffold.of(context).closeDrawer();
              },
            ),
            ListTile(
              leading: const Icon(Icons.check_circle),
              title: const Text('测试'),
              onTap: () {
                context.read<MyState>().changePage(MyPage.test);
                Scaffold.of(context).closeDrawer();
              },
            ),
          ],
        ));
  }
}
