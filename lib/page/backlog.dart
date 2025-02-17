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
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: ListView(
                children: [
                  const BacklogItems(),
                  BacklogCountButton(isExpend, changeValue),
                  BacklogItems(completed: true, show: isExpend),
                ],
              ),
            ),
            const BottomInput(),
          ],
        ),
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
      padding: const EdgeInsets.symmetric(vertical: 8.0),
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
      child: Row(
        children: [
          OutlinedButton(
            style: OutlinedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0),
              ),
              side: const BorderSide(color: Colors.teal),
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
        onReorder: (oldIndex, newIndex) {
          if (newIndex > oldIndex) {
            newIndex -= 1;
          }
          final item = backlogs.removeAt(oldIndex);
          backlogs.insert(newIndex, item);
        },
        itemCount: backlogs.length,
        itemBuilder: (context, index) {
          return Card(
            key: ValueKey(backlogs[index]),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8.0),
            ),
            elevation: 2,
            margin: const EdgeInsets.symmetric(vertical: 4.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8.0),
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
                title: Text(
                  backlogs[index].name,
                  style: TextStyle(
                    decoration: backlogs[index].completed
                        ? TextDecoration.lineThrough
                        : TextDecoration.none,
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
