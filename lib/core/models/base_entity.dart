import 'sync_status.dart';

abstract class BaseEntity {
  String get id;
  DateTime? get createdAt;
  DateTime? get updatedAt;
  SyncStatus get syncStatus;

  Map<String, dynamic> toJson();
}
