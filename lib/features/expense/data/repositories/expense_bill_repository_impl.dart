import 'dart:convert';
import 'package:universal_io/io.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
// import 'package:path/path.dart' as p;
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/expense_bill_repository.dart';
import '../api/expense_bill_api_service.dart';
import '../models/expense_bill_model.dart';

class ExpenseBillRepositoryImpl implements ExpenseBillRepository {
  final ExpenseBillApiService _apiService;
  // ignore: unused_field
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  ExpenseBillRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<ExpenseBillModel> saveBillLocally(String expenseId, File file, String type) async {
    final id = const Uuid().v4();
    // String fileName = p.basename(file.path);
    String fileName = file.path.split('/').last; // Simple fallback
    int fileSize = 0;
    try {
      fileSize = file.lengthSync();
    } catch (_) {}
    
    final bill = ExpenseBillModel(
      id: id,
      expenseId: expenseId,
      filePath: file.path,
      fileName: fileName,
      fileType: type,
      fileSize: fileSize,
    );
    
    // In real app, save 'bill' to database
    return bill;
  }

  @override
  Future<void> deleteBill(String billId) async {
    // Delete from DB and file system
  }

  @override
  Future<List<ExpenseBillModel>> getBillsForExpense(String expenseId) async {
    // Return saved bills from DB
    return [];
  }

  @override
  Future<void> queueBillForUpload(ExpenseBillModel bill) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.uploadBill(bill, File(bill.filePath));
      } catch (e) {
        await _syncManager.enqueueOperation('ExpenseBill', bill.id, 'UPLOAD', jsonEncode(bill.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('ExpenseBill', bill.id, 'UPLOAD', jsonEncode(bill.toJson()));
    }
  }
}

final expenseBillRepositoryProvider = Provider<ExpenseBillRepository>((ref) {
  return ExpenseBillRepositoryImpl(
    ref.watch(expenseBillApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
