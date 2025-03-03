import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/node.dart';
import 'package:possible/page/backlog.dart';
import 'package:possible/page/test.dart';
import 'package:possible/page/today.dart';
import 'package:possible/state/state.dart';
import 'package:uuid/uuid.dart';

// 定义常量，用于设置间距
const double itemSpacing = 4;

class HomePage extends GetView<DataController> {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Theme.of(context).colorScheme.surface,
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Theme.of(context).colorScheme.surface,
          body: Column(
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ListTile(
                    leading: Icon(Icons.wb_sunny_outlined),
                    title: Text('我的一天'),
                    onTap: () => Get.to(() => TodayPage(),
                        transition: Transition.rightToLeft),
                  ),
                  SizedBox(height: itemSpacing),
                  ListTile(
                    leading: Icon(Icons.notes_outlined),
                    title: Text('备忘录'),
                    onTap: () => Get.to(() => BackLogPage(),
                        transition: Transition.rightToLeft),
                  ),
                  SizedBox(height: itemSpacing),
                  ListTile(
                    leading: Icon(Icons.science_outlined),
                    title: Text('测试设置'),
                    onTap: () => Get.to(() => TestPage(),
                        transition: Transition.rightToLeft),
                  ),
                ],
              ),
              SizedBox(height: itemSpacing / 2),
              Divider(
                height: 1,
              ),
              SizedBox(height: itemSpacing / 2),
              Expanded(
                child: Obx(() => ListView.builder(
                      itemCount: controller.projects.length,
                      itemBuilder: (context, index) {
                        var project = controller.projects[index].value;
                        return ListTile(
                          key: ValueKey(project.id),
                          leading: Icon(Icons.list),
                          title: Text(project.name),
                          onTap: () {
                            // todo 跳转到project
                          },
                        );
                      },
                    )),
              ),
              SizedBox(
                height: itemSpacing,
              ),
              ListTile(
                leading: Icon(
                  Icons.add_outlined,
                  color: Colors.blue,
                ),
                title: Text('新建项目', style: TextStyle(color: Colors.blue)),
                onTap: () {
                  var textController = TextEditingController();
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: Text('新建项目'),
                        content: TextField(
                          controller: textController,
                          autofocus: true,
                          decoration: InputDecoration(
                            hintText: '请输入项目名称',
                          ),
                          onSubmitted: (value) {
                            var project = Plan(
                                id: const Uuid().v4(),
                                name: textController.text,
                                index: DateTime.now().millisecondsSinceEpoch);
                            controller.projects.add(project.obs);
                            Get.back();
                          },
                        ),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Get.back(); // 使用GetX关闭对话框
                            },
                            child: Text('取消'),
                          ),
                          TextButton(
                            onPressed: () {
                              var project = Plan(
                                  id: const Uuid().v4(),
                                  name: textController.text,
                                  index: DateTime.now().millisecondsSinceEpoch);
                              controller.projects.add(project.obs);
                              // 处理新建项目的逻辑
                              Get.back(); // 使用GetX关闭对话框
                            },
                            child: Text('确定'),
                          ),
                        ],
                      );
                    },
                  );
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
