import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/assets.dart';
import 'package:possible/page/today.dart';
import 'package:possible/state/state.dart';

void main() {
  // 设置本地时区
  WidgetsFlutterBinding.ensureInitialized();
  debugPrint('当前时区: ${DateTime.now().timeZoneName}');
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Possible',
      debugShowCheckedModeBanner: false,
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: ThemeMode.system,
      initialBinding: BindingsBuilder(() {
        Get.put(DataController());
      }),
      home: TodayPage(),
    );
  }
}
