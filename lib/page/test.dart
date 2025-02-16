import 'package:flutter/material.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
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
              child: const Text('清空项目')),
          TextButton(
              onPressed: () {
                for (var i = 0; i < 10; i++) {
                  context.read<MyState>().addBacklog(Node(
                      id: 'project$i',
                      name: 'project$i',
                      index: DateTime.now().millisecondsSinceEpoch,
                      position: Point(0, 0)));
                }
              },
              child: const Text("创建备忘录数据")),
        ],
      ),
    );
  }
}
