import 'package:flutter/material.dart';
import 'package:possible/component/navigator.dart';

class DefaultLayout extends StatelessWidget {
  final String title;
  final Widget child;

  const DefaultLayout({super.key, required this.title, required this.child});

  Widget _buildDrawer() {
    return const Drawer(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.zero,
      ),
      child: NavigatorWidget(),
    );
  }

  PreferredSizeWidget _buildAppBar(bool isPhone) {
    return AppBar(
      title: isPhone ? Center(child: Text(title)) : Text(title),
      elevation: 0,
    );
  }

  Widget _buildMobileLayout() {
    return Scaffold(
      appBar: _buildAppBar(true),
      drawer: _buildDrawer(),
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
