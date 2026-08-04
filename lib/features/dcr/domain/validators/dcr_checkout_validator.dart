import '../repositories/dcr_checkout_repository.dart';
import '../../data/models/dcr_checkout_model.dart';

class DcrCheckOutValidator {
  final DcrCheckOutRepository _repository;
  
  DcrCheckOutValidator(this._repository);
  
  Future<String?> validateCheckOut(DcrCheckOutModel model) async {
    final hasCheckedIn = await _repository.hasCheckedIn(model.checkInId);
    if (!hasCheckedIn) {
      return 'No active check-in found.';
    }

    if (model.visitDurationMinutes < 0) {
      return 'Invalid visit duration.';
    }

    if (model.callStatus.isEmpty) {
      return 'Call status is mandatory.';
    }

    return null;
  }
}
