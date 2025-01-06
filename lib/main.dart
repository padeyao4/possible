import 'package:flutter/material.dart';
import 'project_one_screen.dart';
import 'project_two_screen.dart';

// 项目数据模型
class ProjectItem {
  final String id;
  final String name;
  final String route;
  final IconData icon;
  final DateTime createdAt;

  ProjectItem({
    required this.id,
    required this.name,
    required this.route,
    this.icon = Icons.folder,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();
}

// 常量定义
class AppConstants {
  static const double navigationWidth = 300;
  static const double padding = 16.0;
  static const double dividerWidth = 1;

  // 主题颜色
  static const Color primaryColor = Colors.blueAccent;
  static const Color backgroundColor = Color(0xFFF5F5F5);
  static const Color textPrimaryColor = Color(0xFF333333);
  static const Color textSecondaryColor = Color(0xFF666666);

  // 动画时长
  static const Duration animationDuration = Duration(milliseconds: 300);
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '云帆',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppConstants.primaryColor,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        scaffoldBackgroundColor: AppConstants.backgroundColor,
        textTheme: const TextTheme(
          bodyLarge: TextStyle(color: AppConstants.textPrimaryColor),
          bodyMedium: TextStyle(color: AppConstants.textSecondaryColor),
        ),
        appBarTheme: const AppBarTheme(
          elevation: 0,
          backgroundColor: Colors.transparent,
        ),
      ),
      routes: {
        '/project1': (context) => const ProjectOneScreen(),
        '/project2': (context) => const ProjectTwoScreen(),
      },
      home: const HomeScreen(),
    );
  }
}

// 导航栏头部 Widget
class _NavigationHeader extends StatelessWidget {
  const _NavigationHeader();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppConstants.padding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('我的一天',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Row(
            children: [
              const Text('备忘录',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.search),
                onPressed: () {
                  // TODO: 实现搜索功能
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// 项目列表项 Widget
class _ProjectListItem extends StatelessWidget {
  final ProjectItem project;
  final VoidCallback onTap;

  const _ProjectListItem({
    required this.project,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(project.icon),
      title: Text(project.name),
      subtitle: Text(
        '创建于 ${project.createdAt.toString().split(' ')[0]}',
        style: Theme.of(context).textTheme.bodySmall,
      ),
      trailing: PopupMenuButton<String>(
        itemBuilder: (context) => [
          const PopupMenuItem(
            value: 'rename',
            child: Text('重命名'),
          ),
          const PopupMenuItem(
            value: 'delete',
            child: Text('删除'),
          ),
        ],
        onSelected: (value) {
          // TODO: 处理菜单选项
        },
      ),
      onTap: onTap,
    );
  }
}

// 创建按钮 Widget
class _CreateButton extends StatelessWidget {
  final VoidCallback onPressed;

  const _CreateButton({required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppConstants.padding),
      child: FilledButton.icon(
        icon: const Icon(Icons.add),
        label: const Text('创建新项目'),
        onPressed: onPressed,
      ),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<ProjectItem> projects = [
    ProjectItem(
      id: '1',
      name: '项目1',
      route: '/project1',
      icon: Icons.folder_special,
      createdAt: DateTime(2024, 1, 1),
    ),
    ProjectItem(
      id: '2',
      name: '项目2',
      route: '/project2',
      icon: Icons.folder_shared,
      createdAt: DateTime(2024, 1, 2),
    ),
  ];

  void _handleProjectTap(ProjectItem project) {
    Navigator.pushNamed(context, project.route);
  }

  Future<void> _handleCreateButtonTap() async {
    final result = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('创建新项目'),
        content: TextField(
          decoration: const InputDecoration(
            labelText: '项目名称',
            border: OutlineInputBorder(),
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          FilledButton(
            onPressed: () {
              // TODO: 处理创建项目逻辑
              Navigator.pop(context);
            },
            child: const Text('创建'),
          ),
        ],
      ),
    );

    if (result != null) {
      setState(() {
        projects.add(
          ProjectItem(
            id: DateTime.now().millisecondsSinceEpoch.toString(),
            name: result,
            route: '/project${projects.length + 1}',
          ),
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        toolbarHeight: 0,
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth > 600) {
            return Row(
              children: [
                ConstrainedBox(
                  constraints: const BoxConstraints(
                    maxWidth: AppConstants.navigationWidth,
                  ),
                  child: Container(
                    color: Colors.grey[100],
                    child: Column(
                      children: [
                        const _NavigationHeader(),
                        const Divider(),
                        Expanded(
                          child: ListView.builder(
                            itemCount: projects.length,
                            itemBuilder: (context, index) {
                              return _ProjectListItem(
                                project: projects[index],
                                onTap: () => _handleProjectTap(projects[index]),
                              );
                            },
                          ),
                        ),
                        _CreateButton(onPressed: _handleCreateButtonTap),
                      ],
                    ),
                  ),
                ),
                const VerticalDivider(width: AppConstants.dividerWidth),
                const Expanded(
                  child: Center(
                    child: Text('内容区域'),
                  ),
                ),
                const VerticalDivider(width: AppConstants.dividerWidth),
                ConstrainedBox(
                  constraints: const BoxConstraints(
                    maxWidth: AppConstants.navigationWidth,
                  ),
                  child: Container(
                    color: Colors.grey[100],
                    child: const Center(
                      child: Text('编辑和属性展示区域'),
                    ),
                  ),
                ),
              ],
            );
          } else {
            return Column(
              children: [
                Expanded(
                  child: ListView(
                    children: [
                      const _NavigationHeader(),
                      const Divider(),
                      ...projects.map((project) => _ProjectListItem(
                            project: project,
                            onTap: () => _handleProjectTap(project),
                          )),
                    ],
                  ),
                ),
                _CreateButton(onPressed: _handleCreateButtonTap),
              ],
            );
          }
        },
      ),
    );
  }
}
