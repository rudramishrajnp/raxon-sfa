import 'package:flutter_riverpod/flutter_riverpod.dart';

class MapNavigationService {
  Future<void> navigateTo(double latitude, double longitude) async {
    // In a real app, you would use url_launcher:
    // final uri = Uri.parse('google.navigation:q=$latitude,$longitude');
    // if (await canLaunchUrl(uri)) {
    //   await launchUrl(uri);
    // } else {
    //   // fallback to maps url
    //   final webUri = Uri.parse('https://www.google.com/maps/search/?api=1&query=$latitude,$longitude');
    //   await launchUrl(webUri);
    // }
    print('Navigating to $latitude, $longitude');
  }
}

final mapNavigationServiceProvider = Provider<MapNavigationService>((ref) {
  return MapNavigationService();
});
