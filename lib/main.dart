import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '云帆',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blueAccent,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // 假数据
  final List<String> projects = [
    '项目1',
    '项目2',
    '项目3',
    '项目4',
  ];

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
          // 根据屏幕宽度判断布局方式
          if (constraints.maxWidth > 600) {
            // PC端布局
            return Row(
              children: [
                // 左侧导航栏
                ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 300),
                  child: Container(
                    color: Colors.grey[100],
                    child: Column(
                      children: [
                        // 头部固定项
                        const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('我的一天',
                                  style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold)),
                              SizedBox(height: 8),
                              Text('备忘录',
                                  style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        const Divider(),
                        // 项目列表
                        Expanded(
                          child: ListView.builder(
                            itemCount: projects.length,
                            itemBuilder: (context, index) {
                              return ListTile(
                                title: Text(projects[index]),
                                onTap: () {},
                              );
                            },
                          ),
                        ),
                        // 创建按钮
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: FilledButton.icon(
                            icon: const Icon(Icons.add),
                            label: const Text('创建新项目'),
                            onPressed: () {},
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const VerticalDivider(width: 1),
                // 中间内容区域
                const Expanded(
                  child: Center(
                    child: Text('内容区域'),
                  ),
                ),
                const VerticalDivider(width: 1),
                // 右侧编辑区域
                ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 300),
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
            // 手机端布局
            return Column(
              children: [
                // 顶部导航
                Expanded(
                  child: ListView(
                    children: [
                      const Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('我的一天',
                                style: TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.bold)),
                            SizedBox(height: 8),
                            Text('备忘录',
                                style: TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                      const Divider(),
                      // 项目列表
                      ...projects.map((project) => ListTile(
                            title: Text(project),
                            onTap: () {},
                          )),
                    ],
                  ),
                ),
                // 创建按钮
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: FilledButton.icon(
                    icon: const Icon(Icons.add),
                    label: const Text('创建新项目'),
                    onPressed: () {},
                  ),
                ),
              ],
            );
          }
        },
      ),
    );
  }
}
