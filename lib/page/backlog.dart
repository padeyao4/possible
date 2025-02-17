import 'package:flutter/material.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

class BackLogPage extends StatefulWidget {
  const BackLogPage({super.key});

  @override
  State<BackLogPage> createState() => _BackLogPageState();
}

class _BackLogPageState extends State<BackLogPage> {
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
    ));
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
        decoration: const InputDecoration(
          border: OutlineInputBorder(),
          labelText: 'Add a new backlog item',
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
      child: OutlinedButton(
        onPressed: () {
          changeValue();
        },
        child: Row(
          children: [
            isExpend
                ? const Icon(Icons.arrow_drop_down)
                : const Icon(Icons.arrow_drop_up),
            Text('Backlog (${backlogs.length})'),
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
        shrinkWrap: true,
        onReorder: (oldIndex, newIndex) {
          if (newIndex > oldIndex) {
            newIndex -= 1;
          }
          final item = backlogs.removeAt(oldIndex);
          backlogs.insert(newIndex, item);
        },
        itemCount: backlogs.length,
        itemBuilder: (context, index) {
          return ListTile(
            key: ValueKey(backlogs[index]),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10.0),
            ),
            leading: IconButton(
              icon: Icon(
                backlogs[index].completed ? Icons.check_circle : Icons.circle,
              ),
              onPressed: () {
                context.read<MyState>().updateBacklogComplated(backlogs[index]);
              },
            ),
            title: Text(backlogs[index].name),
            onTap: () {
              print('Item $index');
            },
          );
        },
      ),
    );
  }
}
