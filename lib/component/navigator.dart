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
        Divider(
          height: 1,
          thickness: 1,
        ),
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
                      position: Point(0, 0)));
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

class NavBodyList extends StatefulWidget {
  const NavBodyList({super.key});

  @override
  State<NavBodyList> createState() => _NavBodyListState();
}

class _NavBodyListState extends State<NavBodyList> {
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var projects = context.watch<MyState>().projects;
    return Expanded(
      child: Scrollbar(
        thickness: 3,
        child: ScrollConfiguration(
          behavior: ScrollBehavior().copyWith(scrollbars: false),
          child: ReorderableListView.builder(
            itemBuilder: (context, index) {
              var project = projects[index];
              return Padding(
                key: ValueKey(project.id),
                padding: const EdgeInsets.fromLTRB(8, 4, 8, 0),
                child: ListTile(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  key: ValueKey(project.id),
                  title: Text(
                    project.name,
                  ),
                  onTap: () {
                    context.read<MyState>().setProjectPage(project);
                    Scaffold.of(context).closeDrawer();
                  },
                ),
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
        ),
      ),
    );
  }
}

class NavHeaderList extends StatelessWidget {
  const NavHeaderList({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(8, 8, 8, 4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            leading: const Icon(Icons.home),
            title: const Text('我的一天'),
            onTap: () {
              context.read<MyState>().changePage(MyPage.home);
              Scaffold.of(context).closeDrawer();
            },
          ),
          SizedBox(height: 4),
          ListTile(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            leading: const Icon(Icons.note),
            title: const Text('备忘录'),
            onTap: () {
              context.read<MyState>().changePage(MyPage.backLog);
              Scaffold.of(context).closeDrawer();
            },
          ),
          SizedBox(height: 4),
          ListTile(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            leading: const Icon(Icons.check_circle),
            title: const Text('测试'),
            onTap: () {
              context.read<MyState>().changePage(MyPage.test);
              Scaffold.of(context).closeDrawer();
            },
          ),
        ],
      ),
    );
  }
}
