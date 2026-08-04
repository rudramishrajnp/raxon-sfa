import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:internet_connection_checker_plus/internet_connection_checker_plus.dart';

class ConnectivityService {
  final Connectivity _connectivity = Connectivity();
  final InternetConnection _internetChecker = InternetConnection();

  Future<bool> isConnected() async {
    final connectivityResults = await _connectivity.checkConnectivity();
    final bool hasNone = connectivityResults is List
        ? (connectivityResults as List).contains(ConnectivityResult.none)
        : connectivityResults == ConnectivityResult.none;
    if (hasNone) {
      return false;
    }
    // Double check with actual internet connection
    return await _internetChecker.hasInternetAccess;
  }

  Stream<bool> get onConnectionChange {
    return _internetChecker.onStatusChange.map((status) {
      return status == InternetStatus.connected;
    });
  }

  Future<String> getConnectionType() async {
    final results = await _connectivity.checkConnectivity();
    final bool hasNone = results is List
        ? (results as List).contains(ConnectivityResult.none)
        : results == ConnectivityResult.none;
    if (hasNone) {
      return 'None';
    }
    final bool hasWifi = results is List
        ? (results as List).contains(ConnectivityResult.wifi)
        : results == ConnectivityResult.wifi;
    if (hasWifi) return 'WiFi';

    final bool hasMobile = results is List
        ? (results as List).contains(ConnectivityResult.mobile)
        : results == ConnectivityResult.mobile;
    if (hasMobile) return 'Mobile Data';

    return 'Other';
  }
}

final connectivityServiceProvider = Provider<ConnectivityService>((ref) {
  return ConnectivityService();
});
