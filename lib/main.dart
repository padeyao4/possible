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

ThemeData darkTheme = ThemeData.dark().copyWith(
  colorScheme: ColorScheme.dark().copyWith(),
  dividerColor: Colors.grey.shade400,
  splashFactory: NoSplash.splashFactory,
  highlightColor: Colors.transparent,
);

ThemeData lightTheme = ThemeData.light().copyWith(
  colorScheme: ColorScheme.light(),
  dividerColor: Colors.grey.shade400,
  dividerTheme: const DividerThemeData(
    space: 1,
    thickness: 0.5,
  ),
  splashFactory: NoSplash.splashFactory,
  highlightColor: Colors.transparent,
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    if (GetPlatform.isWindows) {
      darkTheme = darkTheme.copyWith(
        textTheme:
            ThemeData.dark().textTheme.apply(fontFamily: 'Microsoft YaHei'),
      );
      lightTheme = lightTheme.copyWith(
        textTheme:
            ThemeData.light().textTheme.apply(fontFamily: 'Microsoft YaHei'),
      );
    }

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
