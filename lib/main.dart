import 'package:flutter/material.dart';
import 'package:possible/component/navigator.dart';
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
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorSchemeSeed: Colors.white,
          brightness: Brightness.light,
        ),
        home: const MainPage(),
      ),
    );
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
        return const Scaffold(
          backgroundColor: Colors.white,
          body: Row(
            children: [
              Card(
                margin: EdgeInsets.zero,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
                elevation: 4,
                child: NavigatorWidget(),
              ),
              Expanded(
                child: ContentWidget(),
              ),
            ],
          ),
        );
      } else {
        return Scaffold(
          backgroundColor: Colors.white,
          body: const ContentWidget(showTitle: false),
          appBar: AppBar(
            title: Text(title),
            centerTitle: true,
            elevation: 2,
          ),
          drawer: const Drawer(
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.zero,
            ),
            child: NavigatorWidget(),
          ),
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
      body: Container(
        margin: const EdgeInsets.all(0),
        child: getWidget(page),
      ),
      appBar: showTitle
          ? AppBar(
              title: Text(title),
              centerTitle: true,
              elevation: 2,
            )
          : null,
    );
  }
}
