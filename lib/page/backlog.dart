import 'package:flutter/material.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

class BackLogPage extends StatefulWidget {
  const BackLogPage({super.key});

  @override
  State<BackLogPage> createState() => BackLogPageState();
}

class BackLogPageState extends State<BackLogPage> {
  var isExpend = false;

  void changeValue() {
    setState(() {
      isExpend = !isExpend;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 8),
            children: [
              const BacklogItems(),
              BacklogCountButton(isExpend, changeValue),
              BacklogItems(completed: true, show: isExpend),
            ],
          ),
        ),
        const BottomInput(),
      ],
    );
  }
}

class BottomInput extends StatelessWidget {
  const BottomInput({super.key});

  @override
  Widget build(BuildContext context) {
    var textController = TextEditingController();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 32.0),
      child: TextField(
        autofocus: true,
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8.0),
          ),
          labelText: '添加待办事项',
          filled: true,
          fillColor: Colors.grey[200],
        ),
        controller: textController,
        onSubmitted: (value) {
          if (value.isNotEmpty) {
            var node = Node(
                id: value,
                name: value,
                index: DateTime.now().millisecondsSinceEpoch,
                position: Point(0, 0));
            context.read<MyState>().addBacklog(node);
            textController.clear();
          }
        },
      ),
    );
  }
}

class BacklogCountButton extends StatelessWidget {
  final bool isExpend;
  final Function changeValue;

  const BacklogCountButton(this.isExpend, this.changeValue, {super.key});

  @override
  Widget build(BuildContext context) {
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
                side: const BorderSide(color: Colors.grey),
                padding: const EdgeInsets.symmetric(
                    horizontal: 16.0, vertical: 12.0),
              ),
              onPressed: () {
                changeValue();
              },
              child: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  isExpend
                      ? const Icon(Icons.arrow_drop_down, color: Colors.teal)
                      : const Icon(Icons.arrow_right, color: Colors.teal),
                  Text(
                    '已完成 ${backlogs.length}',
                    style: const TextStyle(color: Colors.teal),
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
            key: ValueKey(backlogs[index]),
            color: Colors.transparent,
            child: Container(
              margin: const EdgeInsets.symmetric(vertical: 2.0),
              decoration: BoxDecoration(
                color: Colors.grey.shade50, // 添加背景色
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(8.0),
              ),
              child: ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
                leading: IconButton(
                  icon: Icon(
                    backlogs[index].completed
                        ? Icons.check_circle
                        : Icons.circle,
                    color:
                        backlogs[index].completed ? Colors.green : Colors.grey,
                  ),
                  onPressed: () {
                    context
                        .read<MyState>()
                        .updateBacklogComplated(backlogs[index]);
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
                  print('Item $index');
                },
              ),
            ),
          );
        },
      ),
    );
  }
}
