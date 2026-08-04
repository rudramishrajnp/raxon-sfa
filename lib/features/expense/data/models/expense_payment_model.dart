class ExpensePaymentModel {
  final String id;
  final String expenseId;
  final String financeId;
  final DateTime paymentDate;
  final String paymentMode;
  final String? transactionNumber;
  final String? referenceNumber;
  final String status;

  ExpensePaymentModel({
    required this.id,
    required this.expenseId,
    required this.financeId,
    required this.paymentDate,
    required this.paymentMode,
    this.transactionNumber,
    this.referenceNumber,
    required this.status,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'expenseId': expenseId,
        'financeId': financeId,
        'paymentDate': paymentDate.toIso8601String(),
        'paymentMode': paymentMode,
        'transactionNumber': transactionNumber,
        'referenceNumber': referenceNumber,
        'status': status,
      };

  factory ExpensePaymentModel.fromJson(Map<String, dynamic> json) => ExpensePaymentModel(
        id: json['id'],
        expenseId: json['expenseId'],
        financeId: json['financeId'],
        paymentDate: DateTime.parse(json['paymentDate']),
        paymentMode: json['paymentMode'],
        transactionNumber: json['transactionNumber'],
        referenceNumber: json['referenceNumber'],
        status: json['status'],
      );
}
