import '../../data/models/expense_bill_model.dart';

abstract class BillUploadState {}

class BillUploadInitial extends BillUploadState {}
class BillUploadLoading extends BillUploadState {}
class BillUploadLoaded extends BillUploadState {
  final List<ExpenseBillModel> bills;
  BillUploadLoaded(this.bills);
}
class BillUploadError extends BillUploadState {
  final String message;
  BillUploadError(this.message);
}
class BillUploadSuccess extends BillUploadState {
  final String message;
  BillUploadSuccess(this.message);
}
