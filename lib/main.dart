import 'package:flutter/material.dart';
import 'screen/canvas.dart';

// 任务数据模型
class TaskItem {
  final String id;
  final String title;
  final String category;
  bool isCompleted;
  final DateTime createdAt;

  TaskItem({
    required this.id,
    required this.title,
    required this.category,
    this.isCompleted = false,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '云帆',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: Colors.blue,
      ),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('云帆'),
        ),
        body: const Canvas(),
      ),
    );
  }
}
