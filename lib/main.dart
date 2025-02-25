import 'package:flutter/material.dart';
import 'package:possible/component/navigator.dart';
import 'package:possible/model/assets.dart';
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
          dividerColor: Colors.grey.shade300,
        ),
        // darkTheme: ThemeData.dark(),
        home: const LayoutWidget(),
      ),
    );
  }
}

class LayoutWidget extends StatelessWidget {
  const LayoutWidget({super.key});

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

  @override
  Widget build(BuildContext context) {
    var page = context.watch<MyState>().page;
    var title = getTitle(page, context);

    return LayoutBuilder(builder: (context, constraints) {
      var isPhone = constraints.maxWidth < 800;

      return Scaffold(
        body: isPhone
            ? Scaffold(
                drawer: const Drawer(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero,
                  ),
                  child: NavigatorWidget(),
                ),
                body: Scaffold(
                  body: ContentWidget(),
                ),
              )
            : Row(
                children: [
                  const Card(
                    margin: EdgeInsets.zero,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.zero,
                    ),
                    elevation: 0,
                    child: SizedBox(width: 240, child: NavigatorWidget()),
                  ),
                  VerticalDivider(
                    width: 1,
                    thickness: 0.5,
                    color: Theme.of(context).dividerColor,
                  ),
                  Expanded(
                      child: Scaffold(
                    body: ContentWidget(),
                    appBar: AppBar(
                      title: Text(title),
                      elevation: 0,
                    ),
                  )),
                ],
              ),
        appBar: isPhone
            ? AppBar(
                title: Center(child: Text(title)),
                elevation: 0,
              )
            : null,
        drawer: isPhone
            ? const Drawer(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
                child: NavigatorWidget(),
              )
            : null,
        drawerEnableOpenDragGesture: isPhone,
      );
    });
  }
}

class ContentWidget extends StatelessWidget {
  const ContentWidget({super.key});

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
    return getWidget(page);
  }
}
