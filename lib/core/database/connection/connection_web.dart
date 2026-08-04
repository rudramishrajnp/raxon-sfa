import 'package:drift/drift.dart';
import 'package:drift/web.dart';
import '../../constants/app_constants.dart';

QueryExecutor openConnection() {
  return LazyDatabase(() async {
    return WebDatabase(AppConstants.databaseName);
  });
}
