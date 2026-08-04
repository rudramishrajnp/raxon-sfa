import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/master_models.dart';

class DuplicateDetectionService {
  bool isLikelyDuplicateDoctor(DoctorMasterModel newDoctor, List<DoctorMasterModel> existingDoctors) {
    for (var doc in existingDoctors) {
      if (doc.id == newDoctor.id) continue;
      
      // Match by exact Mobile Number
      if (doc.contactNumber.isNotEmpty && doc.contactNumber == newDoctor.contactNumber) {
        return true;
      }
      // Match by Name + Clinic
      if (doc.name.toLowerCase() == newDoctor.name.toLowerCase() && 
          doc.clinicName.toLowerCase() == newDoctor.clinicName.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  bool isLikelyDuplicateChemist(ChemistMasterModel newChemist, List<ChemistMasterModel> existingChemists) {
    for (var chemist in existingChemists) {
      if (chemist.id == newChemist.id) continue;

      // Match by GST Number
      if (chemist.gstNumber.isNotEmpty && chemist.gstNumber == newChemist.gstNumber) {
        return true;
      }
      // Match by Drug License
      if (chemist.drugLicenseNumber.isNotEmpty && chemist.drugLicenseNumber == newChemist.drugLicenseNumber) {
        return true;
      }
      // Match by Name + Area
      if (chemist.name.toLowerCase() == newChemist.name.toLowerCase() && 
          chemist.area.toLowerCase() == newChemist.area.toLowerCase()) {
        return true;
      }
    }
    return false;
  }
}

final duplicateDetectionServiceProvider = Provider<DuplicateDetectionService>((ref) {
  return DuplicateDetectionService();
});
