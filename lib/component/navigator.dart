import 'package:flutter/material.dart';
import 'package:possible/model/assets.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';
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
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
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
                  ));
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
      child: ReorderableListView(
        shrinkWrap: true,
        padding: EdgeInsets.fromLTRB(10, 4, 10, 0),
        proxyDecorator: (child, index, animation) {
          return Material(
            elevation: 2,
            color: Theme.of(context).colorScheme.surfaceContainerLow,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            child: child,
          );
        },
        children: [
          for (int index = 0; index < projects.length; index++) ...[
            Material(
              key: ValueKey(projects[index]),
              color: Theme.of(context).colorScheme.surfaceContainerLow,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              child: ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                title: Text(
                  projects[index].name,
                  overflow: TextOverflow.ellipsis,
                ),
                onTap: () {
                  context.read<MyState>().setProjectPage(projects[index]);
                  Scaffold.of(context).closeDrawer();
                },
              ),
            ),
            SizedBox(key: ValueKey(index), height: 4),
          ],
        ],
        onReorder: (oldIndex, newIndex) {
          if (newIndex > oldIndex) {
            newIndex -= 1;
          }
          final Node item = projects.removeAt((oldIndex / 2).ceil());
          projects.insert(
              newIndex < 0 ? newIndex : (newIndex / 2).floor(), item);
          context.read<MyState>().notify();
        },
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
                context.read<MyState>().changePage(MyPage.home);
                Scaffold.of(context).closeDrawer();
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
                context.read<MyState>().changePage(MyPage.backLog);
                Scaffold.of(context).closeDrawer();
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
                context.read<MyState>().changePage(MyPage.test);
                Scaffold.of(context).closeDrawer();
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
                context.read<MyState>().changePage(MyPage.demo);
                Scaffold.of(context).closeDrawer();
              },
            ),
          ],
        ),
      ),
    );
  }
}
