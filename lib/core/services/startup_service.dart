import 'package:flutter_riverpod/flutter_riverpod.dart';

enum StartupResult {
  firstTimeUser,
  loggedInUser,
  invalidSession,
  deviceMismatch,
}

class StartupService {
  Future<void> checkInternet() async {
    // Simulate checking internet availability
    await Future.delayed(const Duration(milliseconds: 600));
  }

  Future<void> initializeDatabase() async {
    // Simulate local SQLite database initialization
    await Future.delayed(const Duration(milliseconds: 600));
  }

  Future<void> checkSecureStorage() async {
    // Simulate secure storage verification
    await Future.delayed(const Duration(milliseconds: 400));
  }

  Future<bool> hasJwtToken() async {
    // Simulate checking for existing JWT token
    await Future.delayed(const Duration(milliseconds: 300));
    // Defaulting to false to simulate a first-time user flow for now
    return false;
  }

  Future<bool> isSessionValid() async {
    // Simulate session/JWT validation API call
    await Future.delayed(const Duration(milliseconds: 500));
    return false;
  }

  Future<bool> isDeviceBound() async {
    // Simulate checking if the current device matches the bound device ID
    await Future.delayed(const Duration(milliseconds: 400));
    return true;
  }
}

final startupServiceProvider = Provider<StartupService>((ref) {
  return StartupService();
});
