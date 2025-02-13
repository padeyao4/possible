import 'package:flutter/material.dart';
import 'package:possible/model/content.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

List<Widget> getList(List<Node> projects, MyState state) {
  return projects.map((project) {
    return ListTile(
      title: Text(project.name),
      onTap: () {
        state.setCurrent(project);
        state.changePage(MyPage.project);
      },
    );
  }).toList();
}

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
        // todo 弹出对话框,输入标题
      },
    );
  }
}

class NavBodyList extends StatelessWidget {
  const NavBodyList({super.key});

  @override
  Widget build(BuildContext context) {
    return Expanded(
        child: ListView.builder(
            itemBuilder: (context, index) {
              return ListTile(
                title: Text(context.watch<MyState>().projects[index].name),
              );
            },
            itemCount: context.watch<MyState>().projects.length));
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
          children: [
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text('我的一天'),
              onTap: () {
                context.read<MyState>().changePage(MyPage.home);
              },
            ),
            ListTile(
              leading: const Icon(Icons.note),
              title: const Text('备忘录'),
              onTap: () {
                context.read<MyState>().changePage(MyPage.backLog);
              },
            ),
            ListTile(
              leading: const Icon(Icons.check_circle),
              title: const Text('测试'),
              onTap: () {
                context.read<MyState>().changePage(MyPage.test);
              },
            ),
          ],
        ));
  }
}
