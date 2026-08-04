import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Global Providers Registration
/// 
/// This file serves as the central hub for app-wide global state providers
/// such as initialization states, network connectivity status, etc.
/// Domain-specific providers will remain in their respective feature folders.

final appInitializationProvider = FutureProvider<void>((ref) async {
  // Logic for global app initialization (e.g., verifying tokens, migrating DB)
  // will be executed here before the splash screen completes.
  await Future.delayed(const Duration(milliseconds: 500));
});
