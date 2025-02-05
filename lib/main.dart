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
        create: (context) => MyAppState(),
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
                  child: const HomeWidget()
                ),
              ),
            ],
          ),
        );
      } else {
        return Scaffold(
          body: const Text('home'),
          appBar: AppBar(title: const Text('home')),
          drawer: const Drawer(child: NavigatorWidget()),
        );
      }
    });
  }
}

class HomeWidget extends StatelessWidget {
  const HomeWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: const Text('home'),
      appBar: AppBar(title: const Text('home')),
    );
  }
}
class BackLogWidget extends StatelessWidget {
  const BackLogWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: const Text('备忘录'),
      appBar: AppBar(title: const Text('备忘录')),
    );
  }
}

class NavigatorWidget extends StatelessWidget {
  const NavigatorWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 240,
      child: Column(
        children: [
          GestureDetector(
            onTap: () {
              // todo
              log('this is a log');
            },
            child: const ListTile(
              title: Text('我的一天'),
            ),
          ),
          GestureDetector(
            onTap: () {
              // todo
              log('this is a log');
            },
            child: const ListTile(
              title: Text('备忘录'),
            ),
          ),
          const Divider(),
          const Expanded(
              child: Column(
            children: [
              ListTile(
                title: Text('项目1'),
              ),
              ListTile(
                title: Text('项目2'),
              ),
            ],
          )),
          const Divider(),
          const ListTile(
            title: Text('创建项目'),
          ),
        ],
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {}
