import 'package:flutter/material.dart';
import 'package:possible/main.dart';
import 'package:provider/provider.dart';

class TestPage extends StatelessWidget {
  const TestPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        children: [
          TextButton(
              onPressed: () {
                context.read<MyState>().cleanProjects();
              },
              child: const Text('清空项目'))
        ],
      ),
    );
  }
}
