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
            InkWell(
              child: Container(
                decoration: const BoxDecoration(
                  color: Colors.black12,
                  borderRadius: BorderRadius.all(Radius.circular(8))
                ),
                width: 230,
                height: 40,
                child: const Text('hello'),
              ),
              onTap: () {
                setState(() {
                  selectedIndex = 0;
                  print("selected: $selectedIndex");
                });
              },
            ),
            const Text('Backlog')
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
