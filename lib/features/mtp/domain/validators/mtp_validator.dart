import '../../data/models/mtp_models.dart';

class MtpValidator {
  static String? validateDayPlan(MtpDayModel day) {
    if (day.workType == 'Leave') {
      if (day.doctors.isNotEmpty) {
        return 'Cannot select doctors on a Leave day.';
      }
      return null;
    }

    if (day.workType.isEmpty) {
      return 'Work Type is required.';
    }

    if (day.locationType.isEmpty && day.workType != 'Leave') {
      return 'Location Type is required.';
    }

    // Check for duplicate doctors in a single day
    final doctorIds = day.doctors.map((e) => e.doctorId).toList();
    final uniqueDoctorIds = doctorIds.toSet();
    if (doctorIds.length != uniqueDoctorIds.length) {
      return 'Duplicate doctors selected for this day.';
    }

    return null;
  }
}
