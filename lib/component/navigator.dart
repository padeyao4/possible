import 'package:flutter/material.dart';
import 'package:iconify_flutter/iconify_flutter.dart';
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
          thickness: 0.5,
        ),
        NavBodyList(),
        SizedBox(height: 4),
        Divider(
          height: 1,
          thickness: 0.5,
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
          const VerticalDivider(
            width: 1,
            thickness: 0.5,
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
      controller: _scrollController,
      thickness: 3,
      child: ScrollConfiguration(
        behavior: ScrollBehavior().copyWith(scrollbars: false),
        child: ListView(
          controller: _scrollController,
          children: [
            ReorderableListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              proxyDecorator: (child, index, animation) {
                return Padding(
                  padding: EdgeInsets.fromLTRB(8, 4, 8, 0),
                  child: Material(
                    key: ValueKey(projects[index].id),
                    color: Color.from(
                        alpha: 0.05, red: 239, green: 245, blue: 246),
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
                      ),
                      trailing: ReorderableDragStartListener(
                        index: index,
                        child: Icon(
                          Icons.drag_indicator,
                          size: 20,
                          color: Colors.grey.shade400,
                        ),
                      ),
                    ),
                  ),
                );
              },
              buildDefaultDragHandles: false,
              itemBuilder: (context, index) {
                var project = projects[index];
                return Padding(
                  key: ValueKey(project.id),
                  padding: EdgeInsets.fromLTRB(8, 4, 8, 0),
                  child: Material(
                    key: ValueKey(project.id),
                    color: Colors.transparent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: ListTile(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      key: ValueKey(project.id),
                      title: Padding(
                        padding: const EdgeInsets.only(
                            right: 8.0), // Adjusted padding
                        child: Text(
                          projects[index].name,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      trailing: ReorderableDragStartListener(
                        index: index,
                        child: Icon(
                          Icons.drag_indicator,
                          size: 20,
                          color: Colors.grey.shade400,
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
            )
          ],
        ),
      ),
    ));
  }
}

const String solarSun =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M12 2v1m0 18v1m10-10h-1M3 12H2m17.07-7.07l-.392.393M5.322 18.678l-.393.393m14.141-.001l-.392-.393M5.322 5.322l-.393-.393M6.341 10A6 6 0 1 0 10 6.341"/></svg>';

const String menuList =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2.25 6A.75.75 0 0 1 3 5.25h18a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 6m0 4A.75.75 0 0 1 3 9.25h18a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75m18.211 2.909a.75.75 0 0 1 .13 1.052l-3.9 5a.75.75 0 0 1-1.165.021l-2.1-2.5a.75.75 0 1 1 1.148-.964l1.504 1.79l3.33-4.27a.75.75 0 0 1 1.053-.13M2.25 14a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75m0 4a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75" clip-rule="evenodd"/></svg>';

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
            leading: Iconify(solarSun),
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
            leading: Iconify(menuList),
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
