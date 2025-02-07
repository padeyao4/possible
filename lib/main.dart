import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:developer';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
        create: (context) => MyState(),
        child: const MaterialApp(home: MainPage()));
  }
}

String getTitle(Page page, BuildContext context) {
  switch (page) {
    case Page.home:
      return '我的一天';
    case Page.backLog:
      return '备忘录';
    case Page.test:
      return '测试';
    case Page.project:
      return context.watch<MyState>().current?.name ?? 'empty';
  }
}

class MainPage extends StatelessWidget {
  const MainPage({super.key});

  @override
  Widget build(BuildContext context) {
    var page = context.watch<MyState>().page;
    var title = getTitle(page, context);

    return LayoutBuilder(builder: (context, constraints) {
      if (constraints.maxWidth > 800) {
        return Scaffold(
          body: Row(
            children: [
              const NavigatorWidget(),
              Expanded(
                child: Container(
                    decoration: const BoxDecoration(
                      border: Border(left: BorderSide(color: Colors.black)),
                    ),
                    child: const ContentWidget()),
              ),
            ],
          ),
        );
      } else {
        return Scaffold(
          body: const ContentWidget(
            showTitle: false,
          ),
          appBar: AppBar(title: Text(title)),
          drawer: const Drawer(child: NavigatorWidget()),
        );
      }
    });
  }
}

class ContentWidget extends StatelessWidget {
  final bool showTitle;

  const ContentWidget({super.key, this.showTitle = true});

  Widget getWidget(Page page) {
    switch (page) {
      case Page.home:
        return const HomePage();
      case Page.backLog:
        return const BackLogWidget();
      case Page.test:
        return const TestPage();
      case Page.project:
        return const ProjectPage();
    }
  }

  @override
  Widget build(BuildContext context) {
    var page = context.watch<MyState>().page;
    var title = getTitle(page, context);

    if (showTitle) {
      return Scaffold(
        body: getWidget(page),
        appBar: AppBar(title: Text(title)),
      );
    } else {
      return Scaffold(
        body: getWidget(page),
      );
    }
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Text('home'),
    );
  }
}

class BackLogWidget extends StatelessWidget {
  const BackLogWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Text('备忘录'),
    );
  }
}

class TestPage extends StatelessWidget {
  const TestPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        children: [
          TextButton(
              onPressed: () {
                context.read<MyState>().cleanProjects();
              },
              child: const Text('清空项目'))
        ],
      ),
    );
  }
}

class ProjectPage extends StatelessWidget {
  const ProjectPage({super.key});

  @override
  Widget build(BuildContext context) {
    var node = context.watch<MyState>().current;
    if (node != null) {
      return Scaffold(body: Text(node.name));
    } else {
      return const Scaffold(body: Text('empty'));
    }
  }
}

class NavigatorWidget extends StatelessWidget {
  const NavigatorWidget({super.key});

  List<Widget> getList(List<Node> projects, MyState state) {
    return projects.map((project) {
      return GestureDetector(
        onTap: () {
          state.setCurrent(project);
          state.changePage(Page.project);
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
              context.read<MyState>().changePage(Page.home);
            },
            child: const ListTile(
              title: Text('我的一天'),
            ),
          ),
          GestureDetector(
            onTap: () {
              context.read<MyState>().changePage(Page.backLog);
            },
            child: const ListTile(
              title: Text('备忘录'),
            ),
          ),
          GestureDetector(
            onTap: () {
              context.read<MyState>().changePage(Page.test);
            },
            child: const ListTile(
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
                  index: DateTime.now().microsecond));
            },
            child: const ListTile(
              title: Text('创建项目'),
            ),
          )
        ],
      ),
    );
  }
}

enum Page {
  home,
  backLog,
  project,
  test,
}

class Node {
  String id;
  String name;
  int index;

  Node({required this.id, required this.name, required this.index});
}

class MyState extends ChangeNotifier {
  Page page = Page.home;
  List<Node> projects = [];
  List<Node> backlogs = [];
  Node? current;

  void changePage(Page page) {
    this.page = page;
    notifyListeners();
  }

  void addProject(Node node) {
    projects.add(node);
    notifyListeners();
  }

  void removeProject(Node node) {
    projects.remove(node);
    notifyListeners();
  }

  void cleanProjects() {
    projects.clear();
    notifyListeners();
  }

  void setCurrent(Node node) {
    current = node;
    notifyListeners();
  }
}
