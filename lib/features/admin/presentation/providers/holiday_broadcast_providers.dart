import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/holiday_broadcast_models.dart';
import '../../data/repositories/holiday_broadcast_repository.dart';

final holidaysProvider = FutureProvider.autoDispose<List<HolidayModel>>((ref) async {
  final repo = ref.watch(holidayBroadcastRepositoryProvider);
  return repo.getHolidays();
});

final broadcastsProvider = FutureProvider.autoDispose<List<BroadcastMessageModel>>((ref) async {
  final repo = ref.watch(holidayBroadcastRepositoryProvider);
  return repo.getBroadcasts();
});

final templatesProvider = FutureProvider.autoDispose<List<NotificationTemplateModel>>((ref) async {
  final repo = ref.watch(holidayBroadcastRepositoryProvider);
  return repo.getTemplates();
});

final deliveryTrackingProvider = FutureProvider.family.autoDispose<DeliveryTrackingModel?, String>((ref, id) async {
  final repo = ref.watch(holidayBroadcastRepositoryProvider);
  return repo.getDeliveryTracking(id);
});
