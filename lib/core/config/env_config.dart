enum Environment { dev, staging, prod }

class EnvConfig {
  static late Environment environment;
  static late String apiUrl;
  static late String appName;
  static late bool enableCrashlytics;
  static late bool enablePerformanceMonitoring;

  static void initialize({
    required Environment env,
    required String apiBaseUrl,
    required String appTitle,
    required bool crashlyticsEnabled,
    required bool performanceMonitoringEnabled,
  }) {
    environment = env;
    apiUrl = apiBaseUrl;
    appName = appTitle;
    enableCrashlytics = crashlyticsEnabled;
    enablePerformanceMonitoring = performanceMonitoringEnabled;
  }

  static bool get isProduction => environment == Environment.prod;
  static bool get isDevelopment => environment == Environment.dev;
}
