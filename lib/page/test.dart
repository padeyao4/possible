import 'package:faker/faker.dart';
import 'package:flutter/material.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';

class TestPage extends StatelessWidget {
  const TestPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextButton(
              onPressed: () {
                context.read<MyState>().cleanProjects();
                context.read<MyState>().cleanBacklogs();
              },
              style: TextButton.styleFrom(
                side: const BorderSide(color: Colors.blue, width: 1),
              ),
              child: const Text('清空数据')),
          const SizedBox(height: 8),
          TextButton(
              style: TextButton.styleFrom(
                side: const BorderSide(color: Colors.blue, width: 1),
              ),
              onPressed: () {
                var faker = Faker();
                for (var i = 0; i < 10; i++) {
                  var node = Node(
                    id: Uuid().v4(),
                    name: faker.lorem.sentences(5).join(" "),
                    index: faker.date.dateTime().millisecondsSinceEpoch,
                  );
                  node.completed = faker.randomGenerator.boolean();
                  context.read<MyState>().addBacklog(node);
                }
              },
              child: const Text("创建备忘录数据")),
          const SizedBox(height: 8),
          TextButton(
              style: TextButton.styleFrom(
                side: const BorderSide(color: Colors.blue, width: 1),
              ),
              onPressed: () {
                var faker = Faker();

                for (var i = 0; i < 10; i++) {
                  var node = Node(
                    id: const Uuid().v4(),
                    name: faker.food.dish(),
                    index: DateTime.now().millisecondsSinceEpoch,
                  );
                  node.completed = i % 2 == 0;
                  context.read<MyState>().addProject(node);
                }
              },
              child: const Text("创建项目数据")),
        ],
      ),
    );
  }
}
