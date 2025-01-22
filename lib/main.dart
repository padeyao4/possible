import 'package:flutter/material.dart';
import 'package:possible/page/home.dart';
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
          drawer: const Drawer(),
        );
      }
    });
  }
}

class MyAppState extends ChangeNotifier {}
