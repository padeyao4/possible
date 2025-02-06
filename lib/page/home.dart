import 'package:flutter/material.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth < 768) {
            return Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: const BoxDecoration(
                      color: Colors.black12,
                    ),
                    child: const Center(
                      child: Text('Hello World'),
                    ),
                  ),
                ),
              ],
            );
          } else {
            return Row(
              children: [
                SizedBox(
                  width: 240,
                  child: Column(children: [
                    NavHeaderItem(
                      title: "home",
                      icon: Icons.home,
                      func: () {
                        print("home");
                      },
                    ),
                    const NavHeaderItem(
                      title: "settings",
                      icon: Icons.settings,
                    ),
                  ]),
                ),
                Expanded(
                  child: Container(
                    decoration: const BoxDecoration(
                      color: Colors.black12,
                    ),
                    child: const Center(
                      child: Text('Hello World'),
                    ),
                  ),
                ),
              ],
            );
          }
        },
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Text('Drawer Header'),
            ),
            ListTile(
              title: const Text('Home'),
              leading: const Icon(Icons.home),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: const Text('Settings'),
              leading: const Icon(Icons.settings),
              onTap: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}

class NavHeaderItem extends StatelessWidget {
  final GestureTapCallback? func;
  final String title;
  final IconData icon;

  const NavHeaderItem(
      {super.key, this.func, required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    return InkWell(
        onTap: func,
        child: Row(
          children: [
            Icon(icon),
            Text(title),
          ],
        ));
  }
}
