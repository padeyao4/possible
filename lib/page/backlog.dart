import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:uuid/uuid.dart';

class BackLogPageController extends GetxController {
  var isExpend = false.obs;
  var isFloatButton = true.obs;

  void changeValue() {
    isExpend.value = !isExpend.value;
  }
}

class BackLogPage extends StatelessWidget {
  const BackLogPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(BackLogPageController());

    return Scaffold(
      appBar: AppBar(
        title: const Text('备忘录'),
      ),
      floatingActionButton: Obx(() => Visibility(
            visible: controller.isFloatButton.value,
            child: FloatingActionButton(
              shape: const CircleBorder(),
              onPressed: () {
                controller.isFloatButton.value = false;
                Get.bottomSheet(
                  const BottomInput(),
                  barrierColor: Theme.of(context)
                      .colorScheme
                      .surfaceContainerLow
                      .withAlpha(128),
                ).whenComplete(() {
                  controller.isFloatButton.value = true;
                });
              },
              child: const Icon(Icons.add),
            ),
          )),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
        children: [
          const BacklogItems(),
          const CountButton(),
          Obx(() => BacklogItems(
                completed: true,
                show: controller.isExpend.value,
              )),
        ],
      ),
    );
  }
}

class BottomInput extends GetView<DataController> {
  const BottomInput({super.key});

  @override
  Widget build(BuildContext context) {
    var textController = TextEditingController();
    final focusNode = FocusNode();
    return Container(
      color: Theme.of(context).colorScheme.surface,
      padding: const EdgeInsets.all(16.0),
      child: TextField(
        focusNode: focusNode,
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
            var node = Plan(
              id: Uuid().v4(),
              name: value,
              index: DateTime.now().millisecondsSinceEpoch,
            );
            controller.backlogs.add(node.obs);
            textController.clear();
            focusNode.requestFocus();
          }
        },
      ),
    );
  }
}

class CountButton extends GetView<DataController> {
  const CountButton({super.key});

  @override
  Widget build(BuildContext context) {
    BackLogPageController expendController = Get.find();

    return Obx(() {
      var backlogs = controller.backlogs
          .where((element) => element.value.completed)
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
                  expendController.changeValue();
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Obx(() {
                      return Icon(expendController.isExpend.value
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
    });
  }
}

class BacklogItems extends GetView<DataController> {
  final bool completed; // 是否过滤没有完成的
  final bool show;
  const BacklogItems({super.key, this.completed = false, this.show = true});

  @override
  Widget build(BuildContext context) {
    return Visibility(
      visible: show,
      child: Obx(() {
        var backlogs = controller.backlogs
            .where((element) => element.value.completed == completed)
            .toList();

        return ListView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: backlogs.length,
          itemBuilder: (context, index) {
            var backlog = backlogs[index];
            return Material(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0),
              ),
              key: ValueKey(backlog.value.id),
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
                    icon: Obx(() => Icon(backlog.value.completed
                        ? Icons.check_circle_outline
                        : Icons.circle_outlined)),
                    onPressed: () {
                      backlog.update((value) {
                        value!.completed = !value.completed;
                      });
                    },
                  ),
                  title: Obx(() => Text(
                        backlogs[index].value.name,
                        style: TextStyle(
                          decoration: backlogs[index].value.completed
                              ? TextDecoration.lineThrough
                              : TextDecoration.none,
                        ),
                        overflow: TextOverflow.ellipsis,
                      )),
                  onTap: () {
                    Get.to(() => BacklogDetail(plan: backlog.value),
                        transition: Transition.size);
                  },
                ),
              ),
            );
          },
        );
      }),
    );
  }
}

class BacklogDetail extends GetView<DataController> {
  final Plan plan;
  const BacklogDetail({super.key, required this.plan});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.amber,
      appBar: AppBar(
        title: Text("备忘录"),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("data"),
          Expanded(
              child: ListView(
            children: [
              Card(
                child: Text("111"),
              )
            ],
          )),
          Divider(
            height: 1,
          ),
          SizedBox(
              height: 48,
              child: Align(
                alignment: Alignment.centerRight,
                child: Padding(
                  padding: EdgeInsets.only(right: 16),
                  child: IconButton(
                      onPressed: () {
                        controller.backlogs
                            .removeWhere((item) => item.value.id == plan.id);
                        Get.back();
                      },
                      icon: Icon(Icons.delete_outline)),
                ),
              ))
        ],
      ),
    );
  }
}
