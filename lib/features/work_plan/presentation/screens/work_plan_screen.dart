import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/work_plan_provider.dart';
import '../providers/work_plan_state.dart';
import '../widgets/work_plan_header_widget.dart';
import '../widgets/customer_list_widget.dart';
import '../widgets/deviation_dialog.dart';
import '../widgets/joint_work_dialog.dart';

class WorkPlanScreen extends ConsumerStatefulWidget {
  const WorkPlanScreen({super.key});

  @override
  ConsumerState<WorkPlanScreen> createState() => _WorkPlanScreenState();
}

class _WorkPlanScreenState extends ConsumerState<WorkPlanScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedType = 'All';
  String _selectedStatus = 'All';

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(workPlanNotifierProvider.notifier).loadTodayWorkPlan());
    
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    ref.read(workPlanNotifierProvider.notifier).filterCustomers(
      _searchController.text, 
      _selectedType, 
      _selectedStatus
    );
  }

  void _onFilterChanged() {
    ref.read(workPlanNotifierProvider.notifier).filterCustomers(
      _searchController.text, 
      _selectedType, 
      _selectedStatus
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<WorkPlanState>(workPlanNotifierProvider, (previous, next) {
      if (next is WorkPlanActionSuccess) {
        AppFeedback.showSnackBar(context, next.message);
      } else if (next is WorkPlanError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      }
    });

    final state = ref.watch(workPlanNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Today's Work Plan"),
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'deviation') {
                showDialog(context: context, builder: (_) => const DeviationDialog());
              } else if (value == 'joint_work') {
                showDialog(context: context, builder: (_) => const JointWorkDialog());
              } else if (value == 'add_customer') {
                context.push('/add-customer');
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(value: 'deviation', child: Text('Log MTP Deviation')),
              const PopupMenuItem<String>(value: 'joint_work', child: Text('Record Joint Work')),
              const PopupMenuItem<String>(value: 'add_customer', child: Text('Add New Customer')),
            ],
          ),
        ],
      ),
      body: _buildBody(state),
    );
  }

  Widget _buildBody(WorkPlanState state) {
    if (state is WorkPlanLoading || state is WorkPlanInitial) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is WorkPlanLoaded) {
      return Column(
        children: [
          WorkPlanHeaderWidget(summary: state.summary),
          
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSizes.p16),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search by Name, Specialty, City...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppSizes.radius8)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: AppSizes.p12),
                  ),
                ),
                AppSizes.gap8,
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedType,
                        decoration: const InputDecoration(
                          labelText: 'Customer Type',
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.symmetric(horizontal: AppSizes.p12),
                        ),
                        items: ['All', 'Doctor', 'Chemist'].map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                        onChanged: (v) {
                          if (v != null) {
                            setState(() => _selectedType = v);
                            _onFilterChanged();
                          }
                        },
                      ),
                    ),
                    AppSizes.gap8,
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedStatus,
                        decoration: const InputDecoration(
                          labelText: 'Call Status',
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.symmetric(horizontal: AppSizes.p12),
                        ),
                        items: ['All', 'PENDING', 'COMPLETED'].map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                        onChanged: (v) {
                          if (v != null) {
                            setState(() => _selectedStatus = v);
                            _onFilterChanged();
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          Expanded(
            child: CustomerListWidget(customers: state.filteredCustomers),
          ),
        ],
      );
    }

    return const SizedBox.shrink();
  }
}
