import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/page/backlog.dart';
import 'package:possible/page/test.dart';
import 'package:possible/page/today.dart';
import 'package:possible/state/state.dart';

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
                child: ListView.separated(
                  itemBuilder: (context, index) => ListTile(
                    leading: Icon(Icons.list),
                    title: Text('$index'),
                    onTap: () => {},
                  ),
                  separatorBuilder: (context, index) =>
                      SizedBox(height: itemSpacing),
                  itemCount: 2,
                ),
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
              )
            ],
          ),
        ),
      ),
    );
  }
}
