import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/mtp_models.dart';

class DoctorSelectionWidget extends StatefulWidget {
  final List<MtpDoctorModel> initialSelectedDoctors;
  final Function(List<MtpDoctorModel>) onSelectionChanged;

  const DoctorSelectionWidget({
    super.key,
    required this.initialSelectedDoctors,
    required this.onSelectionChanged,
  });

  @override
  State<DoctorSelectionWidget> createState() => _DoctorSelectionWidgetState();
}

class _DoctorSelectionWidgetState extends State<DoctorSelectionWidget> {
  final TextEditingController _searchController = TextEditingController();
  List<MtpDoctorModel> _allDoctors = [];
  List<MtpDoctorModel> _filteredDoctors = [];
  List<MtpDoctorModel> _selectedDoctors = [];

  @override
  void initState() {
    super.initState();
    _selectedDoctors = List.from(widget.initialSelectedDoctors);
    
    // Simulate loading doctors from a local DB/API
    _allDoctors = [
      MtpDoctorModel(doctorId: 'D1', doctorName: 'Dr. John Doe', specialty: 'Cardiologist'),
      MtpDoctorModel(doctorId: 'D2', doctorName: 'Dr. Jane Smith', specialty: 'Neurologist'),
      MtpDoctorModel(doctorId: 'D3', doctorName: 'Dr. Albert Einstein', specialty: 'Physician'),
      MtpDoctorModel(doctorId: 'D4', doctorName: 'Dr. Marie Curie', specialty: 'Radiologist'),
      MtpDoctorModel(doctorId: 'D5', doctorName: 'Dr. Isaac Newton', specialty: 'Orthopedic'),
    ];
    _filteredDoctors = List.from(_allDoctors);

    _searchController.addListener(() {
      _filterDoctors(_searchController.text);
    });
  }

  void _filterDoctors(String query) {
    if (query.isEmpty) {
      setState(() {
        _filteredDoctors = List.from(_allDoctors);
      });
      return;
    }

    setState(() {
      _filteredDoctors = _allDoctors.where((doctor) {
        return doctor.doctorName.toLowerCase().contains(query.toLowerCase()) ||
               doctor.specialty.toLowerCase().contains(query.toLowerCase());
      }).toList();
    });
  }

  void _toggleDoctor(MtpDoctorModel doctor) {
    setState(() {
      if (_selectedDoctors.any((d) => d.doctorId == doctor.doctorId)) {
        _selectedDoctors.removeWhere((d) => d.doctorId == doctor.doctorId);
      } else {
        _selectedDoctors.add(doctor);
      }
    });
    widget.onSelectionChanged(_selectedDoctors);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        TextField(
          controller: _searchController,
          decoration: InputDecoration(
            hintText: 'Search Doctors or Specialty...',
            prefixIcon: const Icon(Icons.search),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppSizes.radius8)),
            contentPadding: const EdgeInsets.symmetric(horizontal: AppSizes.p16),
          ),
        ),
        AppSizes.gap16,
        if (_selectedDoctors.isNotEmpty) ...[
          Text('Selected (${_selectedDoctors.length})', style: AppTypography.labelMedium),
          AppSizes.gap8,
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _selectedDoctors.map((doc) => Chip(
              label: Text(doc.doctorName, style: AppTypography.labelSmall),
              onDeleted: () => _toggleDoctor(doc),
              backgroundColor: AppColors.primary.withOpacity(0.1),
              deleteIconColor: AppColors.primary,
            )).toList(),
          ),
          const Divider(),
        ],
        ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 300),
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: _filteredDoctors.length,
            itemBuilder: (context, index) {
              final doctor = _filteredDoctors[index];
              final isSelected = _selectedDoctors.any((d) => d.doctorId == doctor.doctorId);
              
              return ListTile(
                title: Text(doctor.doctorName, style: AppTypography.bodyLarge),
                subtitle: Text(doctor.specialty, style: AppTypography.bodySmall),
                trailing: isSelected 
                    ? const Icon(Icons.check_circle, color: AppColors.primary)
                    : const Icon(Icons.circle_outlined, color: AppColors.grey400),
                onTap: () => _toggleDoctor(doctor),
                contentPadding: EdgeInsets.zero,
              );
            },
          ),
        ),
      ],
    );
  }
}
