import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/startup_service.dart';
import 'splash_state.dart';

class SplashNotifier extends StateNotifier<SplashState> {
  final StartupService _startupService;

  SplashNotifier(this._startupService) : super(SplashStateInitial()) {
    _startInitialization();
  }

  Future<void> _startInitialization() async {
    try {
      state = SplashStateLoading("Checking internet availability...");
      await _startupService.checkInternet();

      state = SplashStateLoading("Initializing local database...");
      await _startupService.initializeDatabase();

      state = SplashStateLoading("Verifying secure storage...");
      await _startupService.checkSecureStorage();

      state = SplashStateLoading("Checking authentication token...");
      final hasToken = await _startupService.hasJwtToken();

      if (!hasToken) {
        state = SplashStateCompleted(StartupResult.firstTimeUser);
        return;
      }

      state = SplashStateLoading("Validating session...");
      final isValidSession = await _startupService.isSessionValid();

      if (!isValidSession) {
        state = SplashStateCompleted(StartupResult.invalidSession);
        return;
      }

      state = SplashStateLoading("Checking device binding...");
      final isBound = await _startupService.isDeviceBound();

      if (!isBound) {
        state = SplashStateCompleted(StartupResult.deviceMismatch);
        return;
      }

      state = SplashStateLoading("Loading user profile...");
      // Simulate profile loading time
      await Future.delayed(const Duration(milliseconds: 500));

      state = SplashStateCompleted(StartupResult.loggedInUser);
    } catch (e) {
      state = SplashStateError("Initialization failed: ${e.toString()}");
    }
  }

  void retry() {
    state = SplashStateInitial();
    _startInitialization();
  }
}

final splashNotifierProvider = StateNotifierProvider<SplashNotifier, SplashState>((ref) {
  final startupService = ref.watch(startupServiceProvider);
  return SplashNotifier(startupService);
});
