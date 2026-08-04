import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocalStorageService {
  final SharedPreferences _prefs;

  LocalStorageService(this._prefs);

  static const String _keyRememberMe = 'remember_me';
  static const String _keySavedUserId = 'saved_user_id';

  Future<void> saveRememberMe(bool value, String? userId) async {
    await _prefs.setBool(_keyRememberMe, value);
    if (value && userId != null) {
      await _prefs.setString(_keySavedUserId, userId);
    } else {
      await _prefs.remove(_keySavedUserId);
    }
  }

  bool getRememberMe() {
    return _prefs.getBool(_keyRememberMe) ?? false;
  }

  String? getSavedUserId() {
    return _prefs.getString(_keySavedUserId);
  }


  Future<void> clear() async {
    // Note: Do not clear remember me preferences on logout, 
    // only clear user specific volatile data if any.
  }

  bool? getBool(String key) {
    return _prefs.getBool(key);
  }

  Future<void> saveString(String key, String value) async {
    await _prefs.setString(key, value);
  }

}

final sharedPrefsProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('SharedPreferences must be initialized before use');
});

final localStorageProvider = Provider<LocalStorageService>((ref) {
  final prefs = ref.watch(sharedPrefsProvider);
  return LocalStorageService(prefs);
});
