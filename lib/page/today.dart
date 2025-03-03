import 'package:flutter/material.dart';

class TodayPage extends StatelessWidget {
  const TodayPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("我的一天"),
      ),
      body: Center(
        child: Text("我的一天"),
      ),
    );
  }
}
