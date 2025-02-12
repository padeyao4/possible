import 'package:flutter/material.dart';
import 'package:possible/component/graph.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

class ProjectPage extends StatelessWidget {
  const ProjectPage({super.key});

  @override
  Widget build(BuildContext context) {
    var node = context.watch<MyState>().current;
    return Scaffold(
      body: node != null
          ? const GraphWidget()
          : const Center(child: Text('empty')),
    );
  }
}
