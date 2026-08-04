import '../../data/models/dcr_report_model.dart';
import '../../data/models/product_model.dart';

abstract class DcrReportState {}

class DcrReportInitial extends DcrReportState {}

class DcrReportLoading extends DcrReportState {}

class DcrReportLoaded extends DcrReportState {
  final DcrReportModel report;
  final List<ProductModel> availableProducts;

  DcrReportLoaded({
    required this.report,
    required this.availableProducts,
  });

  DcrReportLoaded copyWith({
    DcrReportModel? report,
    List<ProductModel>? availableProducts,
  }) {
    return DcrReportLoaded(
      report: report ?? this.report,
      availableProducts: availableProducts ?? this.availableProducts,
    );
  }
}

class DcrReportError extends DcrReportState {
  final String message;
  DcrReportError(this.message);
}

class DcrReportSuccess extends DcrReportState {
  final String message;
  DcrReportSuccess(this.message);
}
