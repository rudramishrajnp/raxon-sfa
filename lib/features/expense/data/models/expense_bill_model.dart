class ExpenseBillModel {
  final String id;
  final String expenseId;
  final String filePath;
  final String fileName;
  final String fileType;
  final int fileSize;

  ExpenseBillModel({
    required this.id,
    required this.expenseId,
    required this.filePath,
    required this.fileName,
    required this.fileType,
    required this.fileSize,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'expenseId': expenseId,
        'filePath': filePath,
        'fileName': fileName,
        'fileType': fileType,
        'fileSize': fileSize,
      };

  factory ExpenseBillModel.fromJson(Map<String, dynamic> json) => ExpenseBillModel(
        id: json['id'],
        expenseId: json['expenseId'],
        filePath: json['filePath'],
        fileName: json['fileName'],
        fileType: json['fileType'],
        fileSize: json['fileSize'],
      );
}
