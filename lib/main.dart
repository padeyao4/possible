import 'package:flutter/material.dart';
import 'package:get/get.dart';
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
    var darkTheme = ThemeData.dark().copyWith(
        colorScheme: ColorScheme.dark(),
        dividerColor: Colors.grey.shade300,
        splashFactory: NoSplash.splashFactory,
        highlightColor: Colors.transparent);

    var lightTheme = ThemeData.light().copyWith(
        colorScheme: ColorScheme.light(),
        dividerColor: Colors.grey.shade300,
        splashFactory: NoSplash.splashFactory,
        highlightColor: Colors.transparent);

    return GetMaterialApp(
      title: 'Possible',
      debugShowCheckedModeBanner: false,
      theme: context.isDarkMode ? darkTheme : lightTheme,
      initialBinding: BindingsBuilder(() {
        Get.put(DataController());
      }),
      home: TodayPage(),
    );
  }
}
