import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/master_models.dart';
import '../../data/repositories/master_data_repository.dart';

final doctorsProvider = FutureProvider.autoDispose<List<DoctorMasterModel>>((ref) async {
  final repo = ref.watch(masterDataRepositoryProvider);
  return repo.getDoctors();
});

final chemistsProvider = FutureProvider.autoDispose<List<ChemistMasterModel>>((ref) async {
  final repo = ref.watch(masterDataRepositoryProvider);
  return repo.getChemists();
});

final productsProvider = FutureProvider.autoDispose<List<ProductMasterModel>>((ref) async {
  final repo = ref.watch(masterDataRepositoryProvider);
  return repo.getProducts();
});

final pendingApprovalsProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final doctors = await ref.watch(doctorsProvider.future);
  final chemists = await ref.watch(chemistsProvider.future);
  
  return {
    'doctors': doctors.where((d) => d.approvalStatus == 'Pending').toList(),
    'chemists': chemists.where((c) => c.approvalStatus == 'Pending').toList(),
  };
});
