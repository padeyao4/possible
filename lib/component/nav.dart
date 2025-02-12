import 'package:flutter/material.dart';
import 'package:possible/model/content.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

class NavigatorWidget extends StatelessWidget {
  const NavigatorWidget({super.key});

  List<Widget> getList(List<Node> projects, MyState state) {
    return projects.map((project) {
      return GestureDetector(
        onTap: () {
          state.setCurrent(project);
          state.changePage(MyPage.project);
        },
        child: ListTile(
          title: Text(project.name),
        ),
      );
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    var projects = context.watch<MyState>().projects;

    return SizedBox(
      width: 240,
      child: Column(
        children: [
          GestureDetector(
            onTap: () {
              context.read<MyState>().changePage(MyPage.home);
            },
            child: const ListTile(
              leading: Icon(Icons.home),
              title: Text('我的一天'),
            ),
          ),
          GestureDetector(
            onTap: () {
              context.read<MyState>().changePage(MyPage.backLog);
            },
            child: const ListTile(
              leading: Icon(Icons.note),
              title: Text('备忘录'),
            ),
          ),
          GestureDetector(
            onTap: () {
              context.read<MyState>().changePage(MyPage.test);
            },
            child: const ListTile(
              leading: Icon(Icons.check_circle),
              title: Text('测试'),
            ),
          ),
          const Divider(),
          Expanded(
              child: ListView(
            children: getList(projects, context.read<MyState>()),
          )),
          const Divider(),
          GestureDetector(
            onTap: () {
              context.read<MyState>().addProject(Node(
                  id: projects.length.toString(),
                  name: 'project-${projects.length}',
                  index: DateTime.now().microsecond,
                  position: Point(x: 0, y: 0)));
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.add),
                    Text('添加项目'),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.settings),
                  onPressed: () {
                    // Add your settings action here
                  },
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
