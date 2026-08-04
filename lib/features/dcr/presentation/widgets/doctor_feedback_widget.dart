import 'package:flutter/material.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';

class DoctorFeedbackWidget extends StatefulWidget {
  final Function({
    required String callStatus,
    String? doctorMood,
    String? productInterest,
    String? competitorActivity,
    String? newOpportunity,
    String? complaint,
    required bool followUpRequired,
    String? nextVisitNotes,
    String? remarks,
  }) onFeedbackChanged;

  const DoctorFeedbackWidget({super.key, required this.onFeedbackChanged});

  @override
  State<DoctorFeedbackWidget> createState() => _DoctorFeedbackWidgetState();
}

class _DoctorFeedbackWidgetState extends State<DoctorFeedbackWidget> {
  String _callStatus = 'Completed';
  String? _doctorMood;
  final _productInterestController = TextEditingController();
  final _competitorActivityController = TextEditingController();
  final _newOpportunityController = TextEditingController();
  final _complaintController = TextEditingController();
  bool _followUpRequired = false;
  final _nextVisitNotesController = TextEditingController();
  final _remarksController = TextEditingController();

  final List<String> _callStatuses = [
    'Completed',
    'Partially Completed',
    'No Contact',
    'Doctor Not Available',
    'Clinic Closed',
    'Rescheduled',
  ];

  final List<String> _moods = ['Excellent', 'Good', 'Average', 'Poor'];

  @override
  void dispose() {
    _productInterestController.dispose();
    _competitorActivityController.dispose();
    _newOpportunityController.dispose();
    _complaintController.dispose();
    _nextVisitNotesController.dispose();
    _remarksController.dispose();
    super.dispose();
  }

  void _notify() {
    widget.onFeedbackChanged(
      callStatus: _callStatus,
      doctorMood: _doctorMood,
      productInterest: _productInterestController.text.isNotEmpty ? _productInterestController.text : null,
      competitorActivity: _competitorActivityController.text.isNotEmpty ? _competitorActivityController.text : null,
      newOpportunity: _newOpportunityController.text.isNotEmpty ? _newOpportunityController.text : null,
      complaint: _complaintController.text.isNotEmpty ? _complaintController.text : null,
      followUpRequired: _followUpRequired,
      nextVisitNotes: _nextVisitNotesController.text.isNotEmpty ? _nextVisitNotesController.text : null,
      remarks: _remarksController.text.isNotEmpty ? _remarksController.text : null,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Call Status *', style: AppTypography.labelLarge),
        AppSizes.gap8,
        DropdownButtonFormField<String>(
          value: _callStatus,
          decoration: const InputDecoration(border: OutlineInputBorder()),
          items: _callStatuses.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
          onChanged: (v) {
            if (v != null) {
              setState(() => _callStatus = v);
              _notify();
            }
          },
        ),
        AppSizes.gap16,

        Text('Doctor Mood', style: AppTypography.labelLarge),
        AppSizes.gap8,
        DropdownButtonFormField<String>(
          value: _doctorMood,
          decoration: const InputDecoration(border: OutlineInputBorder()),
          items: _moods.map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
          onChanged: (v) {
            setState(() => _doctorMood = v);
            _notify();
          },
        ),
        AppSizes.gap16,

        _buildTextField('Product Interest', _productInterestController),
        AppSizes.gap16,
        _buildTextField('Competitor Activity', _competitorActivityController),
        AppSizes.gap16,
        _buildTextField('New Opportunity', _newOpportunityController),
        AppSizes.gap16,
        _buildTextField('Complaint (if any)', _complaintController),
        AppSizes.gap16,
        
        CheckboxListTile(
          title: const Text('Follow-up Required?'),
          value: _followUpRequired,
          onChanged: (v) {
            setState(() => _followUpRequired = v ?? false);
            _notify();
          },
          contentPadding: EdgeInsets.zero,
          controlAffinity: ListTileControlAffinity.leading,
        ),
        
        if (_followUpRequired) ...[
          AppSizes.gap8,
          _buildTextField('Next Visit Notes', _nextVisitNotesController),
        ],

        AppSizes.gap16,
        _buildTextField('Free Text Remarks', _remarksController),
      ],
    );
  }

  Widget _buildTextField(String label, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.labelMedium),
        AppSizes.gap4,
        TextField(
          controller: controller,
          decoration: const InputDecoration(border: OutlineInputBorder()),
          onChanged: (_) => _notify(),
        ),
      ],
    );
  }
}
