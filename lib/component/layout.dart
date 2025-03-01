import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/component/navigator.dart';
import 'package:possible/state/state.dart';

class DefaultLayout extends GetView<DataController> {
  final String title;
  final Widget child;

  const DefaultLayout({super.key, required this.title, required this.child});

  PreferredSizeWidget _buildAppBar(bool isPhone) {
    return AppBar(
      title: Text(title),
    );
  }

  Widget _buildMobileLayout() {
    return Scaffold(
      appBar: _buildAppBar(true),
      drawer: NavigatorWidget(),
      endDrawer: DetailWidget(),
      drawerEnableOpenDragGesture: true,
      body: child,
    );
  }

  Widget _buildDesktopLayout() {
    return Row(
      children: [
        const Card(
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          elevation: 0,
          child: SizedBox(width: 240, child: NavigatorWidget()),
        ),
        const VerticalDivider(width: 0.5),
        Expanded(
          child: Scaffold(
            appBar: _buildAppBar(false),
            body: child,
          ),
        ),
        Obx(() => Visibility(
              visible: controller.showRightZoo.value,
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

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isPhone = constraints.maxWidth < 800;
        return isPhone ? _buildMobileLayout() : _buildDesktopLayout();
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
      body: Text("hello"),
    );
  }
}
