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
            padding: const EdgeInsets.symmetric(horizontal: 8),
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

class NavBodyList extends StatefulWidget {
  const NavBodyList({super.key});

  @override
  State<NavBodyList> createState() => BodyListState();
}

class BodyListState extends State<NavBodyList> {
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
      controller: _scrollController,
      thickness: 3,
      child: ScrollConfiguration(
          behavior: ScrollBehavior().copyWith(scrollbars: false),
          child: ReorderableListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            proxyDecorator: (child, index, animation) {
              return Padding(
                padding: EdgeInsets.fromLTRB(8, 4, 8, 0),
                child: Material(
                  key: ValueKey(projects[index].id),
                  color:
                      Color.from(alpha: 0.05, red: 239, green: 245, blue: 246),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                    side: BorderSide(
                      color: Colors.grey.shade300,
                      width: 1,
                    ),
                  ),
                  child: ListTile(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      title: Padding(
                        padding: const EdgeInsets.only(
                            right: 8.0), // Adjusted padding
                        child: Text(
                          projects[index].name,
                          overflow: TextOverflow.ellipsis,
                        ),
                      )),
                ),
              );
            },
            buildDefaultDragHandles: false,
            itemBuilder: (context, index) {
              var project = projects[index];
              return Padding(
                key: ValueKey(project.id),
                padding: EdgeInsets.fromLTRB(8, 4, 8, 0),
                child: ReorderableDragStartListener(
                  index: index,
                  child: ListTile(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    key: ValueKey(project.id),
                    title: Padding(
                      padding:
                          const EdgeInsets.only(right: 8.0), // Adjusted padding
                      child: Text(
                        projects[index].name,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    onTap: () {
                      context.read<MyState>().setProjectPage(project);
                      Scaffold.of(context).closeDrawer();
                    },
                  ),
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
          )),
    ));
  }
}

class ProjectItem extends StatelessWidget {
  const ProjectItem({
    super.key,
    required this.projects,
    required this.index,
  });

  final List<Node> projects;
  final int index;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(8, 4, 8, 0),
      child: ListTile(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        title: Text(projects[index].name),
        onTap: () {
          context.read<MyState>().setProjectPage(projects[index]);
          Scaffold.of(context).closeDrawer();
        },
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
    );
  }
}
