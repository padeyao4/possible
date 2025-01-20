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
        child: MaterialApp(
            home: const MyHomePage(), theme: ThemeData(useMaterial3: true)));
  }
}

class MyAppState extends ChangeNotifier {}
