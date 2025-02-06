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
        child: const MaterialApp(home: HomePage()));
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
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
                    child: const ContentWidget(
                      title: 'home',
                    )),
              ),
            ],
          ),
        );
      } else {
        return Scaffold(
          body: const ContentWidget(
            title: 'home',
            showTitle: false,
          ),
          appBar: AppBar(title: const Text('home')),
          drawer: const Drawer(child: NavigatorWidget()),
        );
      }
    });
  }
}

class ContentWidget extends StatelessWidget {
  final String title;
  final bool showTitle;

  const ContentWidget({super.key, required this.title, this.showTitle = true});

  getWidget(Page page) {
    switch (page) {
      case Page.home:
        return const HomeWidget();
      case Page.backLog:
        return const BackLogWidget();
    }
  }

  @override
  Widget build(BuildContext context) {
    var page = context.watch<MyState>().page;

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

class HomeWidget extends StatelessWidget {
  const HomeWidget({super.key});

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

class NavigatorWidget extends StatelessWidget {
  const NavigatorWidget({super.key});

  List<Widget> getList(List<Node> projects) {
    List<Widget> ans = [];
    for (var i = 0; i < projects.length; i++) {
      ans.add(GestureDetector(
        onTap: () {
          // todo
        },
        child: ListTile(
          title: Text(projects[i].name),
        ),
      ));
    }

    return ans;
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
          const Divider(),
          Expanded(
              child: Column(
            children: getList(projects),
          )),
          const Divider(),
          GestureDetector(
            onTap: () {
              // todo test
              context.read<MyState>().addProject(
                  Node(id: '1', name: 'project1', index: projects.length + 1));
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
}
