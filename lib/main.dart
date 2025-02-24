import 'package:flutter/material.dart';
import 'package:possible/component/navigator.dart';
import 'package:possible/model/content.dart';
import 'package:possible/page/backlog.dart';
import 'package:possible/page/demo.dart';
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
            cardColor: Colors.white,
            canvasColor: Colors.white,
            dividerColor: Colors.grey.shade300,
            drawerTheme: DrawerThemeData(backgroundColor: Colors.white),
            scaffoldBackgroundColor: Colors.white),
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
    case MyPage.demo:
      return '例子';
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
              const Card(
                margin: EdgeInsets.zero,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
                elevation: 4,
                child: SizedBox(width: 240, child: NavigatorWidget()),
              ),
              Divider(
                indent: 1,
              ),
              Expanded(child: ContentWidget()),
            ],
          ),
        );
      } else {
        // 侧边栏抽屉,在手机上显示
        return Scaffold(
          body: const ContentWidget(showTitle: false),
          appBar: AppBar(
            title: Center(child: Text(title)),

            /// The elevation of the widget.
            ///
            /// This property controls the size of the shadow below the widget.
            /// A higher value will result in a more pronounced shadow.
            elevation: 0,
          ),
          drawer: const Drawer(
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.zero,
            ),
            child: NavigatorWidget(),
          ),
          drawerEnableOpenDragGesture: true,
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
      case MyPage.demo:
        return const Demo();
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
              elevation: 1,
            )
          : null,
    );
  }
}
