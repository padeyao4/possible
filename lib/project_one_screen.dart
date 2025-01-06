import 'package:flutter/material.dart';

class ProjectOneScreen extends StatelessWidget {
  const ProjectOneScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('项目一'),
      ),
      body: const Center(
        child: Text('这是项目一的页面'),
      ),
    );
  }
}