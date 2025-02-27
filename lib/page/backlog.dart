import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/component/layout.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import 'package:possible/model/node.dart' as model;

class ExpendController extends GetxController {
  var isExpend = false.obs;

  void changeValue() {
    isExpend.value = !isExpend.value;
  }
}

class BackLogPage extends StatelessWidget {
  const BackLogPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ExpendController());

    return DefaultLayout(
      title: '备忘录',
      child: Scaffold(
        body: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
          children: [
            const BacklogItems(),
            const BacklogCountButton(),
            Obx(() => BacklogItems(
                  completed: true,
                  show: controller.isExpend.value,
                )),
          ],
        ),
        bottomNavigationBar: BottomInput(),
      ),
    );
  }
}

class BottomInput extends StatelessWidget {
  const BottomInput({super.key});

  @override
  Widget build(BuildContext context) {
    var textController = TextEditingController();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 16.0),
      child: TextField(
        autofocus: true,
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8.0),
          ),
          labelText: '添加待办事项',
          filled: true,
        ),
        controller: textController,
        onSubmitted: (value) {
          if (value.isNotEmpty) {
            var node = model.Node(
              id: Uuid().v4(),
              name: value,
              index: DateTime.now().millisecondsSinceEpoch,
            );
            context.read<MyState>().addBacklog(node);
            textController.clear();
          }
        },
      ),
    );
  }
}

class BacklogCountButton extends StatelessWidget {
  const BacklogCountButton({super.key});

  @override
  Widget build(BuildContext context) {
    ExpendController controller = Get.find();

    var backlogs = context
        .watch<MyState>()
        .backlogs
        .where((element) => element.completed)
        .toList();
    return Visibility(
      visible: backlogs.isNotEmpty,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4.0),
        child: Row(
          children: [
            OutlinedButton(
              style: OutlinedButton.styleFrom(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
                padding: const EdgeInsets.symmetric(
                    horizontal: 12.0, vertical: 12.0),
              ),
              onPressed: () {
                controller.changeValue();
              },
              child: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Obx(() {
                    return Icon(controller.isExpend.value
                        ? Icons.arrow_drop_down
                        : Icons.arrow_right);
                  }),
                  Text(
                    '已完成 ${backlogs.length}',
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}

class BacklogItems extends StatelessWidget {
  final bool completed; // 是否过滤没有完成的
  final bool show;
  const BacklogItems({super.key, this.completed = false, this.show = true});

  @override
  Widget build(BuildContext context) {
    var backlogs = context
        .watch<MyState>()
        .backlogs
        .where((element) => element.completed == completed)
        .toList();
    return Visibility(
      visible: show,
      child: ReorderableListView.builder(
        physics: const NeverScrollableScrollPhysics(),
        shrinkWrap: true, // 为了解决无限高度问题
        proxyDecorator: (child, index, animation) {
          return child;
        },
        onReorder: (oldIndex, newIndex) {
          if (newIndex > oldIndex) {
            newIndex -= 1;
          }
          final item = backlogs.removeAt(oldIndex);
          backlogs.insert(newIndex, item);
        },
        itemCount: backlogs.length,
        itemBuilder: (context, index) {
          return Material(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8.0),
            ),
            key: ValueKey(backlogs[index]),
            child: Container(
              margin: const EdgeInsets.symmetric(vertical: 2.0),
              decoration: BoxDecoration(
                border: Border.all(
                    color: Theme.of(context)
                        .colorScheme
                        .primaryContainer), // 添加背景色
                borderRadius: BorderRadius.circular(8.0),
              ),
              child: ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
                leading: IconButton(
                  icon: Icon(
                    backlogs[index].completed
                        ? Icons.check_circle_outline
                        : Icons.circle_outlined,
                  ),
                  onPressed: () {
                    context
                        .read<MyState>()
                        .setBacklogCompleted(backlogs[index]);
                  },
                ),
                title: Padding(
                  padding: const EdgeInsets.only(right: 16.0),
                  child: Text(
                    backlogs[index].name,
                    style: TextStyle(
                      decoration: backlogs[index].completed
                          ? TextDecoration.lineThrough
                          : TextDecoration.none,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                onTap: () {
                  debugPrint('Tapped on: ${backlogs[index].name}');
                },
              ),
            ),
          );
        },
      ),
    );
  }
}
