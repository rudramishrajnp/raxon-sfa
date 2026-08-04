import 'package:universal_io/io.dart';
import 'package:flutter/foundation.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DeviceInfoService {
  final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  
  static const String _deviceIdKey = 'device_unique_id';

  Future<String> getDeviceId() async {
    // Check if we already generated a UUID for this device (fallback mechanism)
    String? storedId = await _storage.read(key: _deviceIdKey);
    if (storedId != null) return storedId;

    String deviceId = '';
    try {
      if (kIsWeb) {
        final webInfo = await _deviceInfo.webBrowserInfo;
        deviceId = '${webInfo.browserName.name}_${const Uuid().v4()}';
      } else if (Platform.isAndroid) {
        final androidInfo = await _deviceInfo.androidInfo;
        deviceId = androidInfo.id; // Unique ID on Android
      } else if (Platform.isIOS) {
        final iosInfo = await _deviceInfo.iosInfo;
        deviceId = iosInfo.identifierForVendor ?? const Uuid().v4(); // Unique ID on iOS
      } else {
        deviceId = const Uuid().v4();
      }
    } catch (e) {
      deviceId = const Uuid().v4();
    }
    
    await _storage.write(key: _deviceIdKey, value: deviceId);
    return deviceId;
  }

  Future<String> getDeviceModel() async {
    try {
      if (kIsWeb) {
        final webInfo = await _deviceInfo.webBrowserInfo;
        return 'Web (${webInfo.browserName.name})';
      } else if (Platform.isAndroid) {
        final androidInfo = await _deviceInfo.androidInfo;
        return '${androidInfo.manufacturer} ${androidInfo.model}';
      } else if (Platform.isIOS) {
        final iosInfo = await _deviceInfo.iosInfo;
        return iosInfo.model;
      }
    } catch (e) {
      return 'Unknown Device';
    }
    return 'Unknown Device';
  }
}

final deviceInfoProvider = Provider<DeviceInfoService>((ref) {
  return DeviceInfoService();
});
