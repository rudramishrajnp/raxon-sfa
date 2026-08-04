import 'package:universal_io/io.dart';
import '../../data/models/expense_bill_model.dart';

abstract class ExpenseBillRepository {
  Future<ExpenseBillModel> saveBillLocally(String expenseId, File file, String type);
  Future<void> deleteBill(String billId);
  Future<List<ExpenseBillModel>> getBillsForExpense(String expenseId);
  Future<void> queueBillForUpload(ExpenseBillModel bill);
}
