import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:possible/model/node.dart';
import 'package:possible/state/state.dart';
import 'package:uuid/uuid.dart';

/// 待办事项页面的控制器
class BackLogPageController extends GetxController {
  /// 是否展开已完成项目列表
  final isExpend = false.obs;

  /// 是否显示浮动按钮
  final isFloatButton = true.obs;

  /// 切换展开/收起状态
  void changeValue() => isExpend.value = !isExpend.value;
}

/// 待办事项主页面
class BackLogPage extends StatelessWidget {
  const BackLogPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(BackLogPageController());

    return Scaffold(
      appBar: AppBar(
        title: const Text('备忘录'),
      ),
      // 添加新待办事项的浮动按钮
      floatingActionButton: _buildFloatingActionButton(context, controller),
      body: _buildBody(),
    );
  }

  /// 构建浮动按钮
  Widget _buildFloatingActionButton(
    BuildContext context,
    BackLogPageController controller,
  ) {
    return Obx(() => Visibility(
          visible: controller.isFloatButton.value,
          child: FloatingActionButton(
            shape: const CircleBorder(),
            onPressed: () => _showBottomSheet(context, controller),
            child: const Icon(Icons.add),
          ),
        ));
  }

  /// 显示底部输入框
  void _showBottomSheet(
      BuildContext context, BackLogPageController controller) {
    controller.isFloatButton.value = false;
    Get.bottomSheet(
      const BottomInput(),
      barrierColor:
          Theme.of(context).colorScheme.surfaceContainerLow.withAlpha(128),
    ).whenComplete(() {
      controller.isFloatButton.value = true;
    });
  }

  /// 构建主体内容
  Widget _buildBody() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
      children: const [
        // 未完成的待办事项列表
        BacklogItems(),
        // 已完成项目的计数按钮
        CountButton(),
        // 已完成的待办事项列表（可展开/收起）
        _CompletedBacklogItems(),
      ],
    );
  }
}

/// 已完成的待办事项列表组件
class _CompletedBacklogItems extends GetView<BackLogPageController> {
  const _CompletedBacklogItems();

  @override
  Widget build(BuildContext context) {
    return Obx(() => BacklogItems(
          completed: true,
          show: controller.isExpend.value,
        ));
  }
}

class BottomInput extends GetView<DataController> {
  const BottomInput({super.key});

  @override
  Widget build(BuildContext context) {
    var textController = TextEditingController();
    final focusNode = FocusNode();
    return Container(
      color: Theme.of(context).colorScheme.surface,
      padding: const EdgeInsets.all(16.0),
      child: TextField(
        focusNode: focusNode,
        autofocus: true,
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8.0),
          ),
          labelText: '添加待办事项',
          filled: true,
        ),
        controller: textController,
        onSubmitted: (value) {
          if (value.isNotEmpty) {
            var node = Plan(
              id: Uuid().v4(),
              name: value,
              index: DateTime.now().millisecondsSinceEpoch,
            );
            controller.backlogs.add(node.obs);
            textController.clear();
            focusNode.requestFocus();
          }
        },
      ),
    );
  }
}

class CountButton extends GetView<DataController> {
  const CountButton({super.key});

  @override
  Widget build(BuildContext context) {
    BackLogPageController expendController = Get.find();

    return Obx(() {
      var backlogs = controller.backlogs
          .where((element) => element.value.completed)
          .toList();
      return Visibility(
        visible: backlogs.isNotEmpty,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: Row(
            children: [
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12.0, vertical: 12.0),
                ),
                onPressed: () {
                  expendController.changeValue();
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Obx(() {
                      return Icon(expendController.isExpend.value
                          ? Icons.arrow_drop_down
                          : Icons.arrow_right);
                    }),
                    Text(
                      '已完成 ${backlogs.length}',
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      );
    });
  }
}

/// 待办事项列表组件
/// 用于显示已完成或未完成的待办事项列表
class BacklogItems extends GetView<DataController> {
  /// 是否只显示已完成的项目
  final bool completed;

  /// 是否显示列表
  final bool show;

  // 样式常量
  static const double _borderRadius = 8.0;
  static const double _verticalMargin = 2.0;

  const BacklogItems({super.key, this.completed = false, this.show = true});

  @override
  Widget build(BuildContext context) {
    return Visibility(
      visible: show,
      child: Obx(() {
        // 根据完成状态过滤待办事项
        final backlogs = controller.backlogs
            .where((element) => element.value.completed == completed)
            .toList();

        return ListView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: backlogs.length,
          itemBuilder: (context, index) =>
              _buildBacklogItem(context, backlogs[index]),
        );
      }),
    );
  }

  /// 构建单个待办事项卡片
  Widget _buildBacklogItem(BuildContext context, Rx<Plan> backlog) {
    return Material(
      shape: _buildBorderRadius(),
      key: ValueKey(backlog.value.id),
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: _verticalMargin),
        decoration: _buildItemDecoration(context),
        child: ListTile(
          shape: _buildBorderRadius(),
          leading: _buildLeadingIcon(backlog),
          title: _buildTitle(backlog),
          onTap: () => _navigateToDetail(backlog),
        ),
      ),
    );
  }

  /// 构建圆角边框
  RoundedRectangleBorder _buildBorderRadius() {
    return RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(_borderRadius),
    );
  }

  /// 构建项目装饰
  BoxDecoration _buildItemDecoration(BuildContext context) {
    return BoxDecoration(
      border: Border.all(
        color: Theme.of(context).colorScheme.primaryContainer,
      ),
      borderRadius: BorderRadius.circular(_borderRadius),
    );
  }

  /// 构建前置图标
  Widget _buildLeadingIcon(Rx<Plan> backlog) {
    return IconButton(
      icon: Obx(() => Icon(backlog.value.completed
          ? Icons.check_circle_outline
          : Icons.circle_outlined)),
      onPressed: () => _toggleCompleted(backlog),
    );
  }

  /// 构建标题文本
  Widget _buildTitle(Rx<Plan> backlog) {
    return Obx(() => Text(
          backlog.value.name,
          style: TextStyle(
            decoration: backlog.value.completed
                ? TextDecoration.lineThrough
                : TextDecoration.none,
          ),
          overflow: TextOverflow.ellipsis,
        ));
  }

  /// 切换待办事项完成状态
  void _toggleCompleted(Rx<Plan> backlog) {
    backlog.update((value) {
      value!.completed = !value.completed;
    });
  }

  /// 导航到详情页面
  void _navigateToDetail(Rx<Plan> backlog) {
    Get.to(() => BacklogDetail(backlog), transition: Transition.size);
  }
}

/// 待办事项详情页面组件
class BacklogDetail extends GetView<DataController> {
  final Rx<Plan> plan;

  // 常量配置
  static const double borderRadiusValue = 8;
  static const double borderWidth = 1.0;
  static const int hintTextAlpha = 64;
  static const double contentPadding = 16.0;
  static const double bottomBarHeight = 48.0;

  const BacklogDetail(this.plan, {super.key});

  /// 设置输入框焦点监听器
  /// [focusNode] 焦点节点
  /// [controller] 文本编辑控制器
  void setupFocusListener(
      FocusNode focusNode, TextEditingController controller) {
    focusNode.addListener(() {
      // 当失去焦点时更新计划内容
      if (!focusNode.hasFocus) {
        final newValue = controller.text;
        plan.update((value) {
          value?.name = newValue;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.tertiaryContainer,
      appBar: AppBar(),
      body: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
        ),
        child: Column(
          children: [
            // 内容区域
            Expanded(
              child: Column(
                children: [
                  Obx(() {
                    final focusNode = FocusNode();
                    final textEditingController = TextEditingController(
                      text: plan.value.name,
                    );
                    setupFocusListener(focusNode, textEditingController);

                    return Padding(
                      padding: const EdgeInsets.all(contentPadding),
                      child: _buildInputContainer(
                        context,
                        focusNode,
                        textEditingController,
                      ),
                    );
                  })
                ],
              ),
            ),
            // 底部操作栏
            const Divider(height: 1),
            _buildBottomBar(),
          ],
        ),
      ),
    );
  }

  /// 构建输入容器
  Widget _buildInputContainer(
    BuildContext context,
    FocusNode focusNode,
    TextEditingController textEditingController,
  ) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadiusValue),
        color: Colors.grey[100],
        border: Border.all(
          color: Colors.grey.shade300,
          width: borderWidth,
        ),
      ),
      child: ListTile(
        leading: _buildCheckButton(),
        title: _buildTextField(focusNode, textEditingController),
      ),
    );
  }

  /// 构建选中按钮
  Widget _buildCheckButton() {
    return Transform.scale(
      scale: 1.0,
      child: IconButton(
        onPressed: () {
          plan.update((value) {
            value?.completed = !value.completed;
          });
        },
        icon: Icon(
          plan.value.completed
              ? Icons.check_circle_outline
              : Icons.circle_outlined,
        ),
      ),
    );
  }

  /// 构建文本输入框
  Widget _buildTextField(
    FocusNode focusNode,
    TextEditingController controller,
  ) {
    return TextField(
      focusNode: focusNode,
      controller: controller,
      decoration: InputDecoration(
        hintText: '请输入内容',
        hintStyle: TextStyle(
          color: Colors.black.withAlpha(hintTextAlpha),
        ),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.transparent),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.transparent),
        ),
      ),
      onSubmitted: (newValue) {
        plan.update((value) {
          value?.name = newValue;
        });
      },
    );
  }

  /// 构建底部操作栏
  Widget _buildBottomBar() {
    return Container(
      height: bottomBarHeight,
      alignment: Alignment.centerRight,
      child: Padding(
        padding: const EdgeInsets.only(right: contentPadding),
        child: IconButton(
          onPressed: () {
            controller.backlogs.remove(plan);
            Get.back();
          },
          icon: const Icon(Icons.delete_outline),
        ),
      ),
    );
  }
}
