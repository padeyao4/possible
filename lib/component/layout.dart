import 'package:flutter/material.dart';
import 'package:possible/component/navigator.dart';

class DefaultLayout extends StatelessWidget {
  final String title;

  final Widget child;

  const DefaultLayout({super.key, required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      var isPhone = constraints.maxWidth < 800;

      return Scaffold(
        body: isPhone
            ? Scaffold(
                drawer: const Drawer(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero,
                  ),
                  child: NavigatorWidget(),
                ),
                body: Scaffold(
                  body: child,
                ),
              )
            : Row(
                children: [
                  const Card(
                    margin: EdgeInsets.zero,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.zero,
                    ),
                    elevation: 0,
                    child: SizedBox(width: 240, child: NavigatorWidget()),
                  ),
                  VerticalDivider(
                    width: 1,
                    thickness: 0.5,
                    color: Theme.of(context).dividerColor,
                  ),
                  Expanded(
                      child: Scaffold(
                    body: child,
                    appBar: AppBar(
                      title: Text(title),
                      elevation: 0,
                    ),
                  )),
                ],
              ),
        appBar: isPhone
            ? AppBar(
                title: Center(child: Text(title)),
                elevation: 0,
              )
            : null,
        drawer: isPhone
            ? const Drawer(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
                child: NavigatorWidget(),
              )
            : null,
        drawerEnableOpenDragGesture: isPhone,
      );
    });
  }
}
