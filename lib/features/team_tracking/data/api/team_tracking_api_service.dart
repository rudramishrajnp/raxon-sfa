import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/team_tracking_models.dart';

class TeamTrackingApiService {
  final Dio _dio;

  TeamTrackingApiService(this._dio);

  Future<List<TeamMemberLocationModel>> getLiveTeamLocations(String managerId, {Map<String, dynamic>? filters}) async {
    // Simulate API Call
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    return [
      TeamMemberLocationModel(
        id: 'MR001',
        name: 'Rahul Sharma',
        employeeCode: 'EMP-101',
        hq: 'Mumbai',
        territory: 'Andheri West',
        currentStatus: 'In Field',
        lastActivityTime: DateTime.now().subtract(const Duration(minutes: 10)),
        lastGpsTime: DateTime.now().subtract(const Duration(minutes: 2)),
        batteryLevel: 78,
        isOnline: true,
        gpsAccuracy: 12.5,
        latitude: 19.1136,
        longitude: 72.8697,
        address: 'Andheri West, Mumbai, Maharashtra',
        speed: 15.5,
      ),
      TeamMemberLocationModel(
        id: 'MR002',
        name: 'Amit Patel',
        employeeCode: 'EMP-102',
        hq: 'Pune',
        territory: 'Shivaji Nagar',
        currentStatus: 'At Doctor',
        lastActivityTime: DateTime.now().subtract(const Duration(minutes: 35)),
        lastGpsTime: DateTime.now().subtract(const Duration(minutes: 5)),
        batteryLevel: 45,
        isOnline: true,
        gpsAccuracy: 8.0,
        latitude: 18.5204,
        longitude: 73.8567,
        address: 'Shivaji Nagar, Pune, Maharashtra',
        speed: 0.0,
      ),
      TeamMemberLocationModel(
        id: 'MR003',
        name: 'Vikram Singh',
        employeeCode: 'EMP-103',
        hq: 'Nashik',
        territory: 'Panchavati',
        currentStatus: 'Offline',
        lastActivityTime: DateTime.now().subtract(const Duration(hours: 2)),
        lastGpsTime: DateTime.now().subtract(const Duration(hours: 1)),
        batteryLevel: 12,
        isOnline: false,
        gpsAccuracy: 25.0,
        latitude: 20.0059,
        longitude: 73.7920,
        address: 'Panchavati, Nashik, Maharashtra',
        speed: 0.0,
      ),
    ];
  }

  Future<List<TrackingEventModel>> getRouteMovement(String employeeId, DateTime date) async {
    // Simulate API Call
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    final baseTime = DateTime(date.year, date.month, date.day, 9, 0); // 9 AM
    return [
      TrackingEventModel(
        timestamp: baseTime,
        eventType: 'Punch In',
        status: 'Completed',
        latitude: 19.1100,
        longitude: 72.8600,
        locationName: 'Home',
      ),
      TrackingEventModel(
        timestamp: baseTime.add(const Duration(minutes: 45)),
        eventType: 'Doctor Check-In',
        customerName: 'Dr. Ramesh Kumar',
        status: 'Completed',
        latitude: 19.1150,
        longitude: 72.8650,
        locationName: 'Sanjeevani Clinic',
      ),
      TrackingEventModel(
        timestamp: baseTime.add(const Duration(minutes: 60)),
        eventType: 'Doctor Check-Out',
        customerName: 'Dr. Ramesh Kumar',
        status: 'Completed',
        latitude: 19.1150,
        longitude: 72.8650,
        locationName: 'Sanjeevani Clinic',
      ),
      TrackingEventModel(
        timestamp: baseTime.add(const Duration(hours: 2)),
        eventType: 'Order Booking',
        customerName: 'Apollo Pharmacy',
        status: 'Completed',
        latitude: 19.1200,
        longitude: 72.8700,
        locationName: 'Apollo Pharmacy, Andheri',
      ),
    ];
  }
}

final teamTrackingApiServiceProvider = Provider<TeamTrackingApiService>((ref) {
  return TeamTrackingApiService(ref.watch(dioProvider));
});
