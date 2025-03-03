import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:possible/model/node.dart';
import 'package:possible/page/backlog.dart';
import 'package:possible/page/test.dart';
import 'package:possible/page/today.dart';
import 'package:possible/state/state.dart';
import 'package:uuid/uuid.dart';

// 定义常量，用于设置间距
const double itemSpacing = 4;

// 提取通用 ListTile 构建函数
Widget buildNavigationListTile({
  required IconData icon,
  required String title,
  required VoidCallback onTap,
}) {
  return Column(
    children: [
      ListTile(
        leading: Icon(icon),
        title: Text(title),
        onTap: onTap,
      ),
      SizedBox(height: itemSpacing),
    ],
  );
}

// 提取新建项目对话框函数
void showNewProjectDialog(BuildContext context, DataController controller) {
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
              index: DateTime.now().millisecondsSinceEpoch,
            );
            controller.projects.add(project.obs);
            Get.back();
          },
        ),
        actions: [
          TextButton(
            onPressed: () {
              Get.back();
            },
            child: Text('取消'),
          ),
          TextButton(
            onPressed: () {
              var project = Plan(
                id: const Uuid().v4(),
                name: textController.text,
                index: DateTime.now().millisecondsSinceEpoch,
              );
              controller.projects.add(project.obs);
              Get.back();
            },
            child: Text('确定'),
          ),
        ],
      );
    },
  );
}

class HomePage extends GetView<DataController> {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    // 设置状态栏颜色与背景颜色一致
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Theme.of(context).colorScheme.surface,
      statusBarIconBrightness: Theme.of(context).brightness == Brightness.light
          ? Brightness.dark
          : Brightness.light,
    ));

    return Container(
      color: Theme.of(context).colorScheme.surface,
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Theme.of(context).colorScheme.surface,
          body: Column(
            children: [
              // 构建导航列表
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  buildNavigationListTile(
                    icon: Icons.wb_sunny_outlined,
                    title: '我的一天',
                    onTap: () => Get.to(() => TodayPage(),
                        transition: Transition.rightToLeft),
                  ),
                  buildNavigationListTile(
                    icon: Icons.notes_outlined,
                    title: '备忘录',
                    onTap: () => Get.to(() => BackLogPage(),
                        transition: Transition.rightToLeft),
                  ),
                  buildNavigationListTile(
                    icon: Icons.science_outlined,
                    title: '测试设置',
                    onTap: () => Get.to(() => TestPage(),
                        transition: Transition.rightToLeft),
                  ),
                ],
              ),
              SizedBox(height: itemSpacing / 2),
              Divider(height: 1),
              SizedBox(height: itemSpacing / 2),
              // 构建项目列表
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
              SizedBox(height: itemSpacing),
              // 新建项目按钮
              ListTile(
                leading: Icon(
                  Icons.add_outlined,
                  color: Colors.blue,
                ),
                title: Text('新建项目', style: TextStyle(color: Colors.blue)),
                onTap: () => showNewProjectDialog(context, controller),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
