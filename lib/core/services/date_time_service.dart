import 'package:intl/intl.dart';

class DateTimeService {
  static const String defaultDateFormat = 'yyyy-MM-dd';
  static const String defaultTimeFormat = 'HH:mm:ss';
  static const String displayDateFormat = 'dd MMM yyyy';
  static const String displayDateTimeFormat = 'dd MMM yyyy, hh:mm a';

  String formatToDate(DateTime date) {
    return DateFormat(defaultDateFormat).format(date);
  }

  String formatToDisplayDate(DateTime date) {
    return DateFormat(displayDateFormat).format(date);
  }

  String formatToDisplayDateTime(DateTime date) {
    return DateFormat(displayDateTimeFormat).format(date);
  }

  DateTime parseDate(String dateString) {
    return DateFormat(defaultDateFormat).parse(dateString);
  }

  bool isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year && date.month == now.month && date.day == now.day;
  }
}
