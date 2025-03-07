import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:get/get.dart';
import 'package:possible/page/home.dart';
import 'package:possible/state/state.dart';

/// 应用程序入口点
void main() {
  // 确保Flutter绑定初始化
  WidgetsFlutterBinding.ensureInitialized();
  debugPrint('当前时区: ${DateTime.now().timeZoneName}');
  runApp(const MyApp());
}

/// 暗色主题配置
ThemeData darkTheme = ThemeData.dark().copyWith(
  colorScheme: const ColorScheme.dark(),
  // 禁用水波纹效果
  splashFactory: NoSplash.splashFactory,
  highlightColor: Colors.transparent,
  // 分割线主题配置
  dividerTheme: const DividerThemeData(
    thickness: 1,
  ),
);

/// 亮色主题配置
ThemeData lightTheme = ThemeData.light().copyWith(
  colorScheme: const ColorScheme.light(),
  // 分割线主题配置
  dividerTheme: const DividerThemeData(
    thickness: 0.5,
    color: Colors.grey,
  ),
  // 禁用水波纹效果
  splashFactory: NoSplash.splashFactory,
  highlightColor: Colors.transparent,
);

/// 主应用程序组件
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Windows平台字体配置
    if (GetPlatform.isWindows) {
      darkTheme = darkTheme.copyWith(
        textTheme: ThemeData.dark().textTheme.apply(
              fontFamily: 'Microsoft YaHei',
            ),
      );
      lightTheme = lightTheme.copyWith(
        textTheme: ThemeData.light().textTheme.apply(
              fontFamily: 'Microsoft YaHei',
            ),
      );
    }

    // 设置状态栏样式
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Theme.of(context).colorScheme.surface,
      statusBarIconBrightness: Theme.of(context).brightness == Brightness.light
          ? Brightness.dark
          : Brightness.light,
    ));

    return GetMaterialApp(
      title: 'Possible',
      debugShowCheckedModeBanner: false,
      // 国际化配置
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('zh', 'CN'),
      ],
      // 主题配置
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: ThemeMode.light,
      // 依赖注入
      initialBinding: BindingsBuilder(() {
        Get.put(DataController());
      }),
      home: const HomePage(),
    );
  }
}
