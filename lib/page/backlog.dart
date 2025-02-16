import 'package:flutter/material.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

class BackLogPage extends StatelessWidget {
  const BackLogPage({super.key});

  @override
  Widget build(BuildContext context) {
    var backlogs = context.watch<MyState>().backlogs;
    return Scaffold(
        body: ReorderableListView.builder(
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
          leading: const Icon(Icons.circle),
          title: Text(backlogs[index].name),
          onTap: () {
            print('Item $index');
          },
        );
      },
    ));
  }
}
