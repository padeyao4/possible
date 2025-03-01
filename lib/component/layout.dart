import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/component/navigator.dart';
import 'package:possible/state/state.dart';

class DefaultLayout extends GetView<DataController> {
  final String title;
  final Widget child;

  const DefaultLayout({super.key, required this.title, required this.child});

  Widget _buildMobileLayout() {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      drawer: NavigatorWidget(),
      endDrawer: Obx(() => DetailWidget()),
      drawerEnableOpenDragGesture: true,
      body: child,
    );
  }

  Widget _buildDesktopLayout() {
    return Row(
      children: [
        SizedBox(width: 250, child: NavigatorWidget()),
        const VerticalDivider(width: 0.5),
        Expanded(
          child: Scaffold(
            appBar: AppBar(
              title: Text(title),
            ),
            body: child,
          ),
        ),
        Obx(() => Visibility(
              visible: controller.isDetailOpen.value,
              child: Row(
                children: [
                  const VerticalDivider(width: 0.5),
                  SizedBox(
                    width: 360,
                    child: DetailWidget(),
                  ),
                ],
              ),
            ))
      ],
    );
  }

  Widget _buildSmallDesktopLayout() {
    return Scaffold(
      key: controller.scaffoldKey,
      appBar: AppBar(
        title: Text(title),
        actions: [SizedBox()],
      ),
      body: child,
      drawer: SizedBox(
        width: 250,
        child: NavigatorWidget(),
      ),
      endDrawer: Drawer(
          width: 320,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          child: DetailWidget()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (GetPlatform.isDesktop) {
          if (constraints.maxWidth < 790) {
            return _buildSmallDesktopLayout();
          }
          return _buildDesktopLayout();
        }
        return _buildMobileLayout();
      },
    );
  }
}

class DetailWidget extends StatelessWidget {
  const DetailWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(color: Colors.grey, child: Text("hello")),
    );
  }
}
