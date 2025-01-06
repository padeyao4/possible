import 'package:flutter/material.dart';

    class ProjectTwoScreen extends StatelessWidget {
      const ProjectTwoScreen({super.key});

      @override
      Widget build(BuildContext context) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('项目二'),
          ),
          body: const Center(
            child: Text('这是项目二的页面'),
          ),
        );
      }
    }