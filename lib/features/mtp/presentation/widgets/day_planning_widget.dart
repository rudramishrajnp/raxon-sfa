import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/mtp_models.dart';
import 'doctor_selection_widget.dart';

class DayPlanningWidget extends StatefulWidget {
  final DateTime date;
  final MtpDayModel? initialPlan;
  final Function(MtpDayModel) onSave;

  const DayPlanningWidget({
    super.key,
    required this.date,
    this.initialPlan,
    required this.onSave,
  });

  @override
  State<DayPlanningWidget> createState() => _DayPlanningWidgetState();
}

class _DayPlanningWidgetState extends State<DayPlanningWidget> {
  String _workType = 'Field Work';
  String _locationType = 'HQ';
  List<MtpDoctorModel> _selectedDoctors = [];
  final TextEditingController _notesController = TextEditingController();

  final List<String> _workTypes = ['Field Work', 'Campaign', 'Meeting', 'Leave'];
  final List<String> _locationTypes = ['HQ', 'Ex-HQ', 'Outstation', 'Transit'];

  @override
  void initState() {
    super.initState();
    if (widget.initialPlan != null) {
      _workType = widget.initialPlan!.workType.isNotEmpty ? widget.initialPlan!.workType : 'Field Work';
      _locationType = widget.initialPlan!.locationType.isNotEmpty ? widget.initialPlan!.locationType : 'HQ';
      _selectedDoctors = List.from(widget.initialPlan!.doctors);
      _notesController.text = widget.initialPlan!.notes ?? '';
    }
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _handleSave() {
    final newPlan = MtpDayModel(
      date: widget.date,
      workType: _workType,
      locationType: _locationType,
      notes: _notesController.text,
      doctors: _selectedDoctors,
    );
    widget.onSave(newPlan);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final isLeave = _workType == 'Leave';

    return Container(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: AppSizes.p24,
        right: AppSizes.p24,
        top: AppSizes.p24,
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Plan for ${DateFormat('dd MMM yyyy').format(widget.date)}',
              style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold),
            ),
            const Divider(height: 32),
            
            Text('Work Type', style: AppTypography.labelLarge),
            AppSizes.gap8,
            DropdownButtonFormField<String>(
              value: _workType,
              items: _workTypes.map((type) => DropdownMenuItem(value: type, child: Text(type))).toList(),
              onChanged: (value) {
                if (value != null) {
                  setState(() {
                    _workType = value;
                    if (value == 'Leave') {
                      _selectedDoctors.clear();
                    }
                  });
                }
              },
              decoration: const InputDecoration(border: OutlineInputBorder()),
            ),
            
            AppSizes.gap16,

            if (!isLeave) ...[
              Text('Location Type', style: AppTypography.labelLarge),
              AppSizes.gap8,
              DropdownButtonFormField<String>(
                value: _locationType,
                items: _locationTypes.map((type) => DropdownMenuItem(value: type, child: Text(type))).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _locationType = value;
                    });
                  }
                },
                decoration: const InputDecoration(border: OutlineInputBorder()),
              ),
              AppSizes.gap24,

              Text('Doctor Selection', style: AppTypography.titleSmall),
              AppSizes.gap8,
              DoctorSelectionWidget(
                initialSelectedDoctors: _selectedDoctors,
                onSelectionChanged: (doctors) {
                  setState(() {
                    _selectedDoctors = doctors;
                  });
                },
              ),
            ],

            AppSizes.gap16,
            TextField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText: 'Notes (Optional)',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
            AppSizes.gap24,

            ElevatedButton(
              onPressed: _handleSave,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: AppSizes.p16),
              ),
              child: const Text('Save Day Plan'),
            ),
            AppSizes.gap24,
          ],
        ),
      ),
    );
  }
}
