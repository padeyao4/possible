import 'package:flutter/material.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('设置'),
        ),
        body: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: 600),
            child: ListView.separated(
              itemBuilder: (context, index) {
                if (index == 0) {
                  return ListTile(
                    title: const Text('主题'),
                    onTap: () {
                      Navigator.of(context).pushNamed('/settings/theme');
                    },
                  );
                } else if (index == 1) {
                  return ListTile(
                    title: const Text('关于'),
                    onTap: () {
                      Navigator.of(context).pushNamed('/settings/about');
                    },
                  );
                }
                return Container(); // Return an empty container for any other index
              },
              separatorBuilder: (context, index) => Divider(
                height: 1,
                thickness: 0.5,
                color: Theme.of(context).dividerColor,
              ),
              itemCount: 2,
            ),
          ),
        ));
  }
}
