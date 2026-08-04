import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/master_models.dart';

abstract class MasterDataRepository {
  Future<List<DoctorMasterModel>> getDoctors();
  Future<void> updateDoctorStatus(String id, String status, {String? remarks});
  
  Future<List<ChemistMasterModel>> getChemists();
  Future<void> updateChemistStatus(String id, String status, {String? remarks});
  
  Future<List<ProductMasterModel>> getProducts();
  Future<void> addProduct(ProductMasterModel product);
}

class MasterDataRepositoryImpl implements MasterDataRepository {
  final List<DoctorMasterModel> _mockDoctors = [
    DoctorMasterModel(
      id: 'd1',
      code: 'DOC-101',
      name: 'Dr. Gregory House',
      qualification: 'MD',
      speciality: 'Diagnostic Medicine',
      clinicName: 'Princeton-Plainsboro',
      hospitalName: 'Teaching Hospital',
      address: '123 Medical Drive',
      area: 'Central',
      city: 'Princeton',
      district: 'Mercer',
      state: 'New Jersey',
      pinCode: '08540',
      contactNumber: '+1234567890',
      email: 'house@ppth.org',
      visitFrequency: 4,
      doctorClass: 'A',
      preferredVisitDays: 'Mon,Wed',
      approvalStatus: 'Pending',
    ),
    DoctorMasterModel(
      id: 'd2',
      code: 'DOC-102',
      name: 'Dr. James Wilson',
      qualification: 'MD',
      speciality: 'Oncology',
      clinicName: 'Princeton-Plainsboro',
      hospitalName: 'Teaching Hospital',
      address: '123 Medical Drive',
      area: 'Central',
      city: 'Princeton',
      district: 'Mercer',
      state: 'New Jersey',
      pinCode: '08540',
      contactNumber: '+0987654321',
      email: 'wilson@ppth.org',
      visitFrequency: 2,
      doctorClass: 'B',
      preferredVisitDays: 'Tue,Thu',
      approvalStatus: 'Approved',
    ),
  ];

  final List<ChemistMasterModel> _mockChemists = [
    ChemistMasterModel(
      id: 'c1',
      code: 'CHM-201',
      name: 'Apollo Pharmacy',
      gstNumber: 'GST12345',
      drugLicenseNumber: 'DL54321',
      ownerName: 'John Smith',
      contact: '+1122334455',
      address: '456 Pharma Lane',
      area: 'West End',
      city: 'Princeton',
      hq: 'HQ-1',
      approvalStatus: 'Pending',
    ),
  ];

  final List<ProductMasterModel> _mockProducts = [
    ProductMasterModel(
      id: 'p1',
      brandName: 'Raxocillin',
      genericName: 'Amoxicillin',
      saltComposition: 'Amoxicillin Trihydrate',
      strength: '500mg',
      dosageForm: 'Capsule',
      packSize: '10x10',
      mrp: 120.0,
      ptr: 80.0,
      pts: 70.0,
      hsnCode: '3004',
      gst: 12.0,
      sampleAvailable: true,
      samplePack: '1x4',
      launchDate: DateTime(2022, 1, 1),
      status: 'Active',
    ),
  ];

  @override
  Future<List<DoctorMasterModel>> getDoctors() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockDoctors.toList();
  }

  @override
  Future<void> updateDoctorStatus(String id, String status, {String? remarks}) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _mockDoctors.indexWhere((d) => d.id == id);
    if (index != -1) {
      _mockDoctors[index] = _mockDoctors[index].copyWith(approvalStatus: status);
    }
  }

  @override
  Future<List<ChemistMasterModel>> getChemists() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockChemists.toList();
  }

  @override
  Future<void> updateChemistStatus(String id, String status, {String? remarks}) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _mockChemists.indexWhere((c) => c.id == id);
    if (index != -1) {
      _mockChemists[index] = _mockChemists[index].copyWith(approvalStatus: status);
    }
  }

  @override
  Future<List<ProductMasterModel>> getProducts() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockProducts.toList();
  }

  @override
  Future<void> addProduct(ProductMasterModel product) async {
    await Future.delayed(const Duration(milliseconds: 500));
    _mockProducts.add(product);
  }
}

final masterDataRepositoryProvider = Provider<MasterDataRepository>((ref) {
  return MasterDataRepositoryImpl();
});
