import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('设置')),
        body: SingleChildScrollView(
            child: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: 520),
            child: Column(children: [
              ThemeSettings(),
              Divider(
                height: 1,
                thickness: 0.5,
                color: Theme.of(context).dividerColor,
              )
            ]),
          ),
        )));
  }
}

class ThemeSettings extends StatelessWidget {
  const ThemeSettings({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          title: const Text(
            '主题',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          ),
        ),
        ListTile(
          title: Text(Get.isDarkMode ? '暗黑模式' : '明亮模式'),
          trailing: Switch(
            value: Get.isDarkMode,
            onChanged: (value) {
              Get.changeThemeMode(
                  Get.isDarkMode ? ThemeMode.light : ThemeMode.dark);
            },
          ),
        ),
      ],
    );
  }
}
