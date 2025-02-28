import 'package:faker/faker.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/component/layout.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:uuid/uuid.dart';

Plan createNode(Offset position) {
  var faker = Faker();
  var node = Plan(
    id: const Uuid().v4(),
    name: faker.animal.name(),
    index: DateTime.now().millisecondsSinceEpoch,
  );
  node.completed = faker.randomGenerator.boolean();
  node.position = position;
  return node;
}

class TestPage extends StatelessWidget {
  const TestPage({super.key});

  @override
  Widget build(BuildContext context) {
    var controller = Get.find<DataController>();

    return DefaultLayout(
        title: '测试',
        child: Scaffold(
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              TextButton(
                  onPressed: () {
                    controller.cleanAll();
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
                      var node = Plan(
                        id: Uuid().v4(),
                        name: faker.lorem.sentences(5).join(" "),
                        index: faker.date.dateTime().millisecondsSinceEpoch,
                      );
                      node.completed = faker.randomGenerator.boolean();
                      controller.backlogs.add(node.obs);
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

                    for (var i = 0; i < 100; i++) {
                      var node = Plan(
                        id: const Uuid().v4(),
                        name: faker.food.dish(),
                        index: DateTime.now().millisecondsSinceEpoch,
                      );
                      node.completed = faker.randomGenerator.boolean();
                      var randomGenerator = faker
                          .randomGenerator; // 优化点：减少重复调用faker.randomGenerator
                      for (var j = 0; j < 10; j++) {
                        node.addChild(createNode(Offset(
                                randomGenerator
                                    .integer(20, min: -20)
                                    .toDouble(), // 优化点：使用randomGenerator减少重复调用
                                randomGenerator
                                    .integer(20, min: -20)
                                    .toDouble()))
                            .obs); // 优化点：使用randomGenerator减少重复调用
                      }
                      controller.projects.add(node.obs);
                    }
                  },
                  child: const Text("创建项目数据")),
            ],
          ),
        ));
  }
}
