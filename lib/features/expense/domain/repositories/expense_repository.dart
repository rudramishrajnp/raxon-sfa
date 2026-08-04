import '../../data/models/expense_model.dart';

abstract class ExpenseRepository {
  Future<void> saveDraft(ExpenseModel expense);
  Future<void> deleteDraft(String id);
  Future<List<ExpenseModel>> getDrafts();
  Future<double> getDaForLocationType(String locationType);
}
