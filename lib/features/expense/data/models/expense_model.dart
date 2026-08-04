import 'misc_expense_model.dart';

class ExpenseModel {
  final String id;
  final DateTime date;
  final String locationType;
  
  final double daAmount;
  
  final String taType;
  final double taDistance;
  final double taRate;
  final double taAmount;
  
  final double miscTotal;
  final double grandTotal;
  
  final String status;
  final List<MiscExpenseModel> miscExpenses;

  ExpenseModel({
    required this.id,
    required this.date,
    required this.locationType,
    required this.daAmount,
    required this.taType,
    required this.taDistance,
    required this.taRate,
    required this.taAmount,
    required this.miscTotal,
    required this.grandTotal,
    this.status = 'Draft',
    this.miscExpenses = const [],
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'date': date.toIso8601String(),
        'locationType': locationType,
        'daAmount': daAmount,
        'taType': taType,
        'taDistance': taDistance,
        'taRate': taRate,
        'taAmount': taAmount,
        'miscTotal': miscTotal,
        'grandTotal': grandTotal,
        'status': status,
        'miscExpenses': miscExpenses.map((e) => e.toJson()).toList(),
      };
      
  ExpenseModel copyWith({
    String? locationType,
    double? daAmount,
    String? taType,
    double? taDistance,
    double? taRate,
    double? taAmount,
    double? miscTotal,
    double? grandTotal,
    String? status,
    List<MiscExpenseModel>? miscExpenses,
  }) {
    return ExpenseModel(
      id: id,
      date: date,
      locationType: locationType ?? this.locationType,
      daAmount: daAmount ?? this.daAmount,
      taType: taType ?? this.taType,
      taDistance: taDistance ?? this.taDistance,
      taRate: taRate ?? this.taRate,
      taAmount: taAmount ?? this.taAmount,
      miscTotal: miscTotal ?? this.miscTotal,
      grandTotal: grandTotal ?? this.grandTotal,
      status: status ?? this.status,
      miscExpenses: miscExpenses ?? this.miscExpenses,
    );
  }
}
