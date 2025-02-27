import 'dart:io';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/page/today.dart';
import 'package:possible/state/state.dart';
import 'package:provider/provider.dart';

void main() {
  // 设置本地时区
  WidgetsFlutterBinding.ensureInitialized();
  if (Platform.isAndroid ||
      Platform.isIOS ||
      Platform.isMacOS ||
      Platform.isWindows ||
      Platform.isLinux) {
    var timeZoneName = DateTime.now().timeZoneName;
    debugPrint('当前时区: $timeZoneName');
  }

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

    return ChangeNotifierProvider(
      create: (context) => MyState(),
      child: GetMaterialApp(
        title: 'Possible',
        debugShowCheckedModeBanner: false,
        theme: context.isDarkMode ? darkTheme : lightTheme,
        home: TodayPage(),
      ),
    );
  }
}
