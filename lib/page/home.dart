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
        body: Row(
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
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(8),
            ),
            color: Colors.black12,
          ),
          child: const Center(
            child: Text('Hello World'),
          ),
        )),
      ],
    ));
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
