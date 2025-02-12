import 'package:flutter/material.dart';
import 'package:possible/component/nav.dart';
import 'package:possible/model/content.dart';
import 'package:possible/page/backlog.dart';
import 'package:possible/page/home.dart';
import 'package:possible/page/project.dart';
import 'package:possible/page/test.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

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

String getTitle(MyPage page, BuildContext context) {
  switch (page) {
    case MyPage.home:
      return '我的一天';
    case MyPage.backLog:
      return '备忘录';
    case MyPage.test:
      return '测试';
    case MyPage.project:
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
          body: const ContentWidget(showTitle: false),
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

  Widget getWidget(MyPage page) {
    switch (page) {
      case MyPage.home:
        return const HomePage();
      case MyPage.backLog:
        return const BackLogPage();
      case MyPage.test:
        return const TestPage();
      case MyPage.project:
        return const ProjectPage();
    }
  }

  @override
  Widget build(BuildContext context) {
    var page = context.watch<MyState>().page;
    var title = getTitle(page, context);

    return Scaffold(
      body: getWidget(page),
      appBar: showTitle ? AppBar(title: Text(title)) : null,
    );
  }
}

class GraphWidget extends StatefulWidget {
  const GraphWidget({super.key});

  @override
  _GraphWidgetState createState() => _GraphWidgetState();
}

class _GraphWidgetState extends State<GraphWidget> {
  Offset position = Offset(100, 100);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned(
            left: position.dx,
            top: position.dy,
            child: GestureDetector(
              onPanUpdate: (details) {
                setState(() {
                  position = Offset(position.dx + details.delta.dx,
                      position.dy + details.delta.dy);
                });
              },
              child: Container(
                width: 100,
                height: 100,
                color: Colors.blue,
                child: const Center(child: Text('拖拽我')),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
