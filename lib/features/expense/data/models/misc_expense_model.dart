class MiscExpenseModel {
  final String id;
  final String expenseId;
  final String category;
  final double amount;
  final String? remarks;

  MiscExpenseModel({
    required this.id,
    required this.expenseId,
    required this.category,
    required this.amount,
    this.remarks,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'expenseId': expenseId,
        'category': category,
        'amount': amount,
        'remarks': remarks,
      };

  factory MiscExpenseModel.fromJson(Map<String, dynamic> json) => MiscExpenseModel(
        id: json['id'],
        expenseId: json['expenseId'],
        category: json['category'],
        amount: (json['amount'] as num).toDouble(),
        remarks: json['remarks'],
      );

  MiscExpenseModel copyWith({
    String? category,
    double? amount,
    String? remarks,
  }) {
    return MiscExpenseModel(
      id: id,
      expenseId: expenseId,
      category: category ?? this.category,
      amount: amount ?? this.amount,
      remarks: remarks ?? this.remarks,
    );
  }
}
