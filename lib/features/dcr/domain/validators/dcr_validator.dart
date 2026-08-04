import '../repositories/dcr_repository.dart';

class DcrValidator {
  final DcrRepository _repository;
  
  DcrValidator(this._repository);
  
  Future<String?> validateCheckIn(String employeeId, String customerId) async {
    final hasPunchedIn = await _repository.hasPunchedInToday(employeeId);
    if (!hasPunchedIn) {
      return 'You must punch in before checking into a customer.';
    }

    final hasCheckedIn = await _repository.hasCheckedInToCustomerToday(employeeId, customerId);
    if (hasCheckedIn) {
      return 'You have already checked in to this customer today.';
    }

    return null;
  }
}
