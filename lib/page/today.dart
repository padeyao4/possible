import 'package:flutter/material.dart';
import 'package:possible/component/layout.dart';

class TodayPage extends StatelessWidget {
  const TodayPage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultLayout(
        title: "我的一天",
        child: Scaffold(
          body: Center(
            child: Text("我的一天"),
          ),
        ));
  }
}
