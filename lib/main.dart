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
        child: const MaterialApp(home: MyHomePage()));
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          SafeArea(
              child: NavigationRail(
            extended: true,
            destinations: const [
              NavigationRailDestination(
                  icon: Icon(Icons.home), label: Text('Home')),
              NavigationRailDestination(
                  icon: Icon(Icons.settings), label: Text('Settings'))
            ],
            selectedIndex: 0,
          )),
          Expanded(
              child: Scaffold(
            appBar: AppBar(title: const Text('Hello World')),
            body: const Center(
              child: Text('Hello World'),
            ),
          ))
        ],
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {}
