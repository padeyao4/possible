import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:possible/page/home.dart';
import 'package:possible/state/state.dart';

void main() {
  // 设置本地时区
  WidgetsFlutterBinding.ensureInitialized();
  debugPrint('当前时区: ${DateTime.now().timeZoneName}');
  runApp(const MyApp());
}

ThemeData darkTheme = ThemeData.dark().copyWith(
  colorScheme: ColorScheme.dark().copyWith(),
  splashFactory: NoSplash.splashFactory,
  highlightColor: Colors.transparent,
  dividerTheme: const DividerThemeData(
    thickness: 1,
  ),
);

ThemeData lightTheme = ThemeData.light().copyWith(
  colorScheme: ColorScheme.light().copyWith(),
  dividerTheme: const DividerThemeData(
    thickness: 0.5,
    color: Colors.grey,
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

    // 设置状态栏颜色与背景颜色一致
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Theme.of(context).colorScheme.surface,
      statusBarIconBrightness: Theme.of(context).brightness == Brightness.light
          ? Brightness.dark
          : Brightness.light,
    ));

    return GetMaterialApp(
      title: 'Possible',
      debugShowCheckedModeBanner: false,
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: ThemeMode.light,
      initialBinding: BindingsBuilder(() {
        Get.put(DataController());
      }),
      home: HomePage(),
    );
  }
}
