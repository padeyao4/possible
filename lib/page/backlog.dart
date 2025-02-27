import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/component/layout.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import 'package:possible/model/node.dart';

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
    final expendController = Get.put(ExpendController());

    return DefaultLayout(
      title: '备忘录',
      child: Scaffold(
        body: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
          children: [
            const BacklogItems(),
            const CountButton(),
            Obx(() => BacklogItems(
                  completed: true,
                  show: expendController.isExpend.value,
                )),
          ],
        ),
        bottomNavigationBar: BottomInput(),
      ),
    );
  }
}

class BottomInput extends GetView<DataController> {
  const BottomInput({super.key});

  @override
  Widget build(BuildContext context) {
    var textController = TextEditingController();
    DataController controller = Get.find();
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
            var node = Plan(
              id: Uuid().v4(),
              name: value,
              index: DateTime.now().millisecondsSinceEpoch,
            );
            controller.backlogs.add(node.obs);
            textController.clear();
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
    ExpendController controller = Get.find();
    DataController dataController = Get.find();

    return Obx(() {
      var backlogs = dataController.backlogs
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
    });
  }
}

class BacklogItems extends GetView<DataController> {
  final bool completed; // 是否过滤没有完成的
  final bool show;
  const BacklogItems({super.key, this.completed = false, this.show = true});

  @override
  Widget build(BuildContext context) {
    DataController controller = Get.find();

    return Visibility(
      visible: show,
      child: Obx(() {
        var backlogs = controller.backlogs
            .where((element) => element.value.completed == completed)
            .toList();

        return ReorderableListView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
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
                    icon: Obx(() => Icon(backlogs[index].value.completed
                        ? Icons.check_circle_outline
                        : Icons.circle_outlined)),
                    onPressed: () {
                      backlogs[index].update((value) {
                        value!.completed = !value.completed;
                      });
                    },
                  ),
                  title: Padding(
                    padding: const EdgeInsets.only(right: 16.0),
                    child: Obx(() => Text(
                          backlogs[index].value.name,
                          style: TextStyle(
                            decoration: backlogs[index].value.completed
                                ? TextDecoration.lineThrough
                                : TextDecoration.none,
                          ),
                          overflow: TextOverflow.ellipsis,
                        )),
                  ),
                  onTap: () {
                    debugPrint('Tapped on: ${backlogs[index].value.name}');
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
