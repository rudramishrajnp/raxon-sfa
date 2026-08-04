import 'package:flutter/material.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/dcr_report_model.dart';
import 'package:intl/intl.dart';

class CallSummaryWidget extends StatefulWidget {
  final CallSummaryModel? summary;
  final ValueChanged<CallSummaryModel> onChanged;

  const CallSummaryWidget({
    super.key,
    this.summary,
    required this.onChanged,
  });

  @override
  State<CallSummaryWidget> createState() => _CallSummaryWidgetState();
}

class _CallSummaryWidgetState extends State<CallSummaryWidget> {
  final TextEditingController _feedbackController = TextEditingController();
  final TextEditingController _competitorController = TextEditingController();
  final TextEditingController _marketController = TextEditingController();
  final TextEditingController _remarksController = TextEditingController();
  DateTime? _nextFollowUpDate;

  @override
  void initState() {
    super.initState();
    if (widget.summary != null) {
      _feedbackController.text = widget.summary!.doctorFeedback ?? '';
      _competitorController.text = widget.summary!.competitorActivity ?? '';
      _marketController.text = widget.summary!.marketFeedback ?? '';
      _remarksController.text = widget.summary!.remarks ?? '';
      _nextFollowUpDate = widget.summary!.nextFollowUpDate;
    }
  }

  void _notifyChanges() {
    widget.onChanged(CallSummaryModel(
      doctorFeedback: _feedbackController.text,
      competitorActivity: _competitorController.text,
      marketFeedback: _marketController.text,
      remarks: _remarksController.text,
      nextFollowUpDate: _nextFollowUpDate,
    ));
  }

  Future<void> _selectDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _nextFollowUpDate ?? DateTime.now().add(const Duration(days: 7)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date != null) {
      setState(() {
        _nextFollowUpDate = date;
        _notifyChanges();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSizes.p24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildTextField('Doctor/Customer Feedback', _feedbackController),
          AppSizes.gap24,
          _buildTextField('Competitor Activity', _competitorController),
          AppSizes.gap24,
          _buildTextField('Market Feedback', _marketController),
          AppSizes.gap24,
          
          Text('Next Follow-up Date', style: AppTypography.labelLarge),
          AppSizes.gap8,
          InkWell(
            onTap: _selectDate,
            child: InputDecorator(
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                suffixIcon: Icon(Icons.calendar_today),
              ),
              child: Text(
                _nextFollowUpDate != null ? DateFormat('MMM dd, yyyy').format(_nextFollowUpDate!) : 'Select Date',
                style: AppTypography.bodyMedium,
              ),
            ),
          ),
          AppSizes.gap24,

          _buildTextField('Additional Remarks *', _remarksController),
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.labelLarge),
        AppSizes.gap8,
        TextField(
          controller: controller,
          maxLines: 3,
          decoration: const InputDecoration(border: OutlineInputBorder()),
          onChanged: (_) => _notifyChanges(),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _feedbackController.dispose();
    _competitorController.dispose();
    _marketController.dispose();
    _remarksController.dispose();
    super.dispose();
  }
}
