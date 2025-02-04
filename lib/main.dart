import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

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
              Expanded(
                child: Container(
                  color: Colors.blue,
                ),
              ),
              Expanded(
                child: Scaffold(
                  body: const Text('home'),
                  appBar: AppBar(title: const Text('home')),
                ),
              ),
            ],
          ),
        );
      } else {
        return Scaffold(
          body: const Text('home'),
          appBar: AppBar(title: const Text('home')),
          drawer: const Drawer(
            child: Column(
              children: [
                ListTile(
                  title: Text('我的一天'),
                ),
                ListTile(
                  title: Text('备忘录'),
                ),
                Divider(),
                Expanded(
                    child: Column(
                  children: [
                    ListTile(
                      title: Text('我的一天'),
                    ),
                    ListTile(
                      title: Text('备忘录'),
                    ),
                  ],
                )),
                Divider(),
                ListTile(
                  title: Text('我的一天'),
                ),
              ],
            ),
          ),
        );
      }
    });
  }
}

class Navigator extends StatelessWidget {
  const Navigator({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        ListTile(
          title: Text('我的一天'),
        ),
        ListTile(
          title: Text('备忘录'),
        ),
        Divider(),
        Expanded(
            child: Column(
          children: [
            ListTile(
              title: Text('我的一天'),
            ),
            ListTile(
              title: Text('备忘录'),
            ),
          ],
        )),
        Divider(),
        ListTile(
          title: Text('我的一天'),
        ),
      ],
    );
  }
}

class MyAppState extends ChangeNotifier {}
