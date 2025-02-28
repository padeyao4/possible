import 'package:get/state_manager.dart';
import 'package:possible/model/node.dart';

class DataController extends GetxController {
  final projects = RxList<Rx<Plan>>();
  final backlogs = RxList<Rx<Plan>>();

  void cleanAll() {
    projects.clear();
    backlogs.clear();
    update();
  }
}
