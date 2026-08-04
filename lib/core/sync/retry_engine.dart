import 'dart:math' as math;

class RetryEngine {
  static const int maxRetries = 5;
  static const int maxFailedRetries = 3; // Before moving to failed queue
  
  // Calculate exponential backoff delay based on retry count
  static Duration calculateDelay(int retryCount) {
    if (retryCount <= 0) return const Duration(seconds: 0);
    // 2^retryCount * 5 seconds (e.g. 10s, 20s, 40s, 80s)
    final seconds = math.pow(2, retryCount) * 5;
    return Duration(seconds: seconds.toInt());
  }

  static bool shouldRetry(int currentRetryCount, bool isNetworkError) {
    if (isNetworkError) {
      return currentRetryCount < maxRetries;
    }
    // For non-network errors (e.g. 500 server error), use a lower threshold
    return currentRetryCount < maxFailedRetries;
  }
}
