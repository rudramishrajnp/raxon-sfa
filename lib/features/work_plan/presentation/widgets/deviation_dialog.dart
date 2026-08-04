import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../providers/work_plan_provider.dart';
import '../../data/models/customer_model.dart';

class DeviationDialog extends ConsumerStatefulWidget {
  const DeviationDialog({super.key});

  @override
  ConsumerState<DeviationDialog> createState() => _DeviationDialogState();
}

class _DeviationDialogState extends ConsumerState<DeviationDialog> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _remarksController = TextEditingController();
  String _selectedReason = 'Urgent Request';
  CustomerModel? _selectedCustomer;
  List<CustomerModel> _searchResults = [];
  bool _isSearching = false;

  final List<String> _reasons = [
    'Urgent Request',
    'Nearby Opportunity',
    'Substitute Visit',
    'Manager Directed',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    _remarksController.dispose();
    super.dispose();
  }

  void _search() async {
    if (_searchController.text.isEmpty) return;
    setState(() => _isSearching = true);
    final results = await ref.read(workPlanNotifierProvider.notifier).searchUnplannedCustomers(_searchController.text);
    setState(() {
      _searchResults = results;
      _isSearching = false;
    });
  }

  void _submit() {
    if (_selectedCustomer == null) return;
    ref.read(workPlanNotifierProvider.notifier).submitDeviation(
      _selectedCustomer!.id, 
      _selectedReason, 
      _remarksController.text.isNotEmpty ? _remarksController.text : null,
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppSizes.radius16)),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p24),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Unplanned Visit (Deviation)', style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold)),
              AppSizes.gap16,
              const Text('Recording an unplanned visit requires managerial notification.'),
              AppSizes.gap24,

              Text('Reason', style: AppTypography.labelLarge),
              AppSizes.gap8,
              DropdownButtonFormField<String>(
                value: _selectedReason,
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: _reasons.map((r) => DropdownMenuItem(value: r, child: Text(r))).toList(),
                onChanged: (v) {
                  if (v != null) setState(() => _selectedReason = v);
                },
              ),
              AppSizes.gap16,

              Text('Search Customer', style: AppTypography.labelLarge),
              AppSizes.gap8,
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      decoration: const InputDecoration(
                        hintText: 'Enter name or ID',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: AppSizes.p12),
                      ),
                      onSubmitted: (_) => _search(),
                    ),
                  ),
                  AppSizes.gap8,
                  IconButton(
                    icon: const Icon(Icons.search),
                    onPressed: _search,
                  ),
                ],
              ),
              if (_isSearching) const Padding(
                padding: EdgeInsets.all(8.0),
                child: Center(child: CircularProgressIndicator()),
              ),
              if (_searchResults.isNotEmpty && _selectedCustomer == null) ...[
                AppSizes.gap8,
                Container(
                  constraints: const BoxConstraints(maxHeight: 150),
                  decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300)),
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: _searchResults.length,
                    itemBuilder: (context, index) {
                      final c = _searchResults[index];
                      return ListTile(
                        title: Text(c.name),
                        subtitle: Text(c.specialty ?? c.type),
                        onTap: () {
                          setState(() {
                            _selectedCustomer = c;
                            _searchResults.clear();
                          });
                        },
                      );
                    },
                  ),
                ),
              ],
              if (_selectedCustomer != null) ...[
                AppSizes.gap16,
                Card(
                  color: Colors.blue.shade50,
                  child: ListTile(
                    title: Text(_selectedCustomer!.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(_selectedCustomer!.address ?? ''),
                    trailing: IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => setState(() => _selectedCustomer = null),
                    ),
                  ),
                ),
              ],

              AppSizes.gap16,
              TextField(
                controller: _remarksController,
                decoration: const InputDecoration(
                  labelText: 'Remarks (Optional)',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),

              AppSizes.gap24,
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Cancel'),
                  ),
                  AppSizes.gap8,
                  AppButton(
                    text: 'Submit Deviation',
                    onPressed: _selectedCustomer != null ? _submit : null,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
