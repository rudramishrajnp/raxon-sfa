import '../../data/repositories/expense_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../domain/repositories/expense_repository.dart';
import '../../domain/validators/expense_validator.dart';
import '../../data/models/expense_model.dart';
import '../../data/models/misc_expense_model.dart';
import 'expense_state.dart';

class ExpenseNotifier extends StateNotifier<ExpenseState> {
  final ExpenseRepository _repository;
  
  String _currentExpenseId = const Uuid().v4();

  ExpenseNotifier(this._repository) : super(ExpenseInitial());

  Future<void> initializeNewExpense(DateTime date, String locationType) async {
    state = ExpenseLoading();
    try {
      final daAmount = await _repository.getDaForLocationType(locationType);
      _currentExpenseId = const Uuid().v4();
      
      _emitLoaded(
        date: date,
        locationType: locationType,
        daAmount: daAmount,
        taType: 'Fixed',
        taDistance: 0.0,
        taRate: 10.0,
        taAmount: 0.0,
        miscExpenses: [],
      );
    } catch (e) {
      state = ExpenseError('Failed to initialize: ${e.toString()}');
    }
  }

  void updateLocationType(String locationType) async {
    if (state is! ExpenseLoaded) return;
    final currentState = state as ExpenseLoaded;
    
    try {
      final daAmount = await _repository.getDaForLocationType(locationType);
      _emitLoaded(
        date: currentState.date,
        locationType: locationType,
        daAmount: daAmount,
        taType: currentState.taType,
        taDistance: currentState.taDistance,
        taRate: currentState.taRate,
        taAmount: currentState.taAmount,
        miscExpenses: currentState.miscExpenses,
      );
    } catch (e) {
      // Ignore for now
    }
  }

  void updateTA({String? type, double? distance, double? rate, double? amount}) {
    if (state is! ExpenseLoaded) return;
    final currentState = state as ExpenseLoaded;
    
    final newType = type ?? currentState.taType;
    final newDistance = distance ?? currentState.taDistance;
    final newRate = rate ?? currentState.taRate;
    
    double newAmount = amount ?? currentState.taAmount;
    if (newType == 'PerKM' && distance != null) {
      newAmount = newDistance * newRate;
    }
    
    _emitLoaded(
      date: currentState.date,
      locationType: currentState.locationType,
      daAmount: currentState.daAmount,
      taType: newType,
      taDistance: newDistance,
      taRate: newRate,
      taAmount: newAmount,
      miscExpenses: currentState.miscExpenses,
    );
  }

  void addMiscExpense(String category, double amount, String? remarks) {
    if (state is! ExpenseLoaded) return;
    final currentState = state as ExpenseLoaded;
    
    final newMisc = MiscExpenseModel(
      id: const Uuid().v4(),
      expenseId: _currentExpenseId,
      category: category,
      amount: amount,
      remarks: remarks,
    );
    
    _emitLoaded(
      date: currentState.date,
      locationType: currentState.locationType,
      daAmount: currentState.daAmount,
      taType: currentState.taType,
      taDistance: currentState.taDistance,
      taRate: currentState.taRate,
      taAmount: currentState.taAmount,
      miscExpenses: [...currentState.miscExpenses, newMisc],
    );
  }
  
  void removeMiscExpense(String id) {
    if (state is! ExpenseLoaded) return;
    final currentState = state as ExpenseLoaded;
    
    _emitLoaded(
      date: currentState.date,
      locationType: currentState.locationType,
      daAmount: currentState.daAmount,
      taType: currentState.taType,
      taDistance: currentState.taDistance,
      taRate: currentState.taRate,
      taAmount: currentState.taAmount,
      miscExpenses: currentState.miscExpenses.where((m) => m.id != id).toList(),
    );
  }

  void _emitLoaded({
    required DateTime date,
    required String locationType,
    required double daAmount,
    required String taType,
    required double taDistance,
    required double taRate,
    required double taAmount,
    required List<MiscExpenseModel> miscExpenses,
  }) {
    double miscTotal = 0.0;
    for (var m in miscExpenses) {
      miscTotal += m.amount;
    }
    
    final grandTotal = daAmount + taAmount + miscTotal;
    
    state = ExpenseLoaded(
      date: date,
      locationType: locationType,
      daAmount: daAmount,
      taType: taType,
      taDistance: taDistance,
      taRate: taRate,
      taAmount: taAmount,
      miscExpenses: miscExpenses,
      grandTotal: grandTotal,
    );
  }

  Future<void> saveDraft() async {
    if (state is! ExpenseLoaded) return;
    final currentState = state as ExpenseLoaded;
    
    double miscTotal = currentState.miscExpenses.fold(0.0, (sum, m) => sum + m.amount);
    
    final expense = ExpenseModel(
      id: _currentExpenseId,
      date: currentState.date,
      locationType: currentState.locationType,
      daAmount: currentState.daAmount,
      taType: currentState.taType,
      taDistance: currentState.taDistance,
      taRate: currentState.taRate,
      taAmount: currentState.taAmount,
      miscTotal: miscTotal,
      grandTotal: currentState.grandTotal,
      status: 'Draft',
      miscExpenses: currentState.miscExpenses,
    );
    
    final validator = ExpenseValidator();
    final error = validator.validateExpense(expense);
    
    if (error != null) {
      state = ExpenseError(error);
      _emitLoaded(
        date: currentState.date,
        locationType: currentState.locationType,
        daAmount: currentState.daAmount,
        taType: currentState.taType,
        taDistance: currentState.taDistance,
        taRate: currentState.taRate,
        taAmount: currentState.taAmount,
        miscExpenses: currentState.miscExpenses,
      );
      return;
    }
    
    state = ExpenseLoading();
    try {
      await _repository.saveDraft(expense);
      state = ExpenseSuccess('Expense saved as draft successfully.');
    } catch (e) {
      state = ExpenseError('Failed to save draft: ${e.toString()}');
      _emitLoaded(
        date: currentState.date,
        locationType: currentState.locationType,
        daAmount: currentState.daAmount,
        taType: currentState.taType,
        taDistance: currentState.taDistance,
        taRate: currentState.taRate,
        taAmount: currentState.taAmount,
        miscExpenses: currentState.miscExpenses,
      );
    }
  }
}

final expenseNotifierProvider = StateNotifierProvider<ExpenseNotifier, ExpenseState>((ref) {
  return ExpenseNotifier(ref.watch(expenseRepositoryProvider));
});
