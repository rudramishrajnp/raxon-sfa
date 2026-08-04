import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/dcr_report_model.dart';

class PrescriptionDetailsWidget extends StatefulWidget {
  final PrescriptionModel? prescription;
  final ValueChanged<PrescriptionModel> onChanged;

  const PrescriptionDetailsWidget({
    super.key,
    this.prescription,
    required this.onChanged,
  });

  @override
  State<PrescriptionDetailsWidget> createState() => _PrescriptionDetailsWidgetState();
}

class _PrescriptionDetailsWidgetState extends State<PrescriptionDetailsWidget> {
  late String _doctorType;
  late List<String> _promotedBrands;
  final TextEditingController _volumeController = TextEditingController();
  final TextEditingController _remarksController = TextEditingController();
  String? _frequency;

  final List<String> _availableBrands = ['Raxon 500', 'Raxon Cold', 'Raxon D3', 'Raxon Plus'];
  final List<String> _frequencies = ['Daily', 'Weekly', 'Monthly', 'Occasional'];

  @override
  void initState() {
    super.initState();
    _doctorType = widget.prescription?.doctorType ?? 'Non-Prescriber';
    _promotedBrands = List.from(widget.prescription?.promotedBrands ?? []);
    if (widget.prescription?.estimatedVolume != null) {
      _volumeController.text = widget.prescription!.estimatedVolume.toString();
    }
    if (widget.prescription?.remarks != null) {
      _remarksController.text = widget.prescription!.remarks!;
    }
    _frequency = widget.prescription?.frequency;
  }

  void _notifyChanges() {
    widget.onChanged(PrescriptionModel(
      doctorType: _doctorType,
      promotedBrands: _promotedBrands,
      estimatedVolume: int.tryParse(_volumeController.text),
      frequency: _frequency,
      remarks: _remarksController.text.isNotEmpty ? _remarksController.text : null,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSizes.p24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Doctor Type', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
          AppSizes.gap8,
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(value: 'Prescriber', label: Text('Prescriber')),
              ButtonSegment(value: 'Non-Prescriber', label: Text('Non-Prescriber')),
            ],
            selected: {_doctorType},
            onSelectionChanged: (set) {
              setState(() {
                _doctorType = set.first;
                if (_doctorType == 'Non-Prescriber') {
                  _promotedBrands.clear();
                  _volumeController.clear();
                  _frequency = null;
                }
                _notifyChanges();
              });
            },
          ),
          AppSizes.gap24,

          if (_doctorType == 'Prescriber') ...[
            Text('Promoted Brands', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap8,
            Wrap(
              spacing: 8,
              children: _availableBrands.map((brand) {
                final isSelected = _promotedBrands.contains(brand);
                return FilterChip(
                  label: Text(brand),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _promotedBrands.add(brand);
                      } else {
                        _promotedBrands.remove(brand);
                      }
                      _notifyChanges();
                    });
                  },
                );
              }).toList(),
            ),
            AppSizes.gap24,

            Text('Estimated Monthly Volume (Rx)', style: AppTypography.labelLarge),
            AppSizes.gap8,
            TextField(
              controller: _volumeController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(border: OutlineInputBorder(), hintText: 'e.g. 100'),
              onChanged: (_) => _notifyChanges(),
            ),
            AppSizes.gap24,

            Text('Prescribing Frequency', style: AppTypography.labelLarge),
            AppSizes.gap8,
            DropdownButtonFormField<String>(
              value: _frequency,
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: _frequencies.map((f) => DropdownMenuItem(value: f, child: Text(f))).toList(),
              onChanged: (val) {
                setState(() {
                  _frequency = val;
                  _notifyChanges();
                });
              },
            ),
            AppSizes.gap24,
          ],

          Text('Remarks', style: AppTypography.labelLarge),
          AppSizes.gap8,
          TextField(
            controller: _remarksController,
            maxLines: 3,
            decoration: const InputDecoration(border: OutlineInputBorder(), hintText: 'Enter any prescription related remarks...'),
            onChanged: (_) => _notifyChanges(),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _volumeController.dispose();
    _remarksController.dispose();
    super.dispose();
  }
}
