import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/add_customer_provider.dart';
import '../../data/models/customer_model.dart';

class AddCustomerScreen extends ConsumerStatefulWidget {
  const AddCustomerScreen({super.key});

  @override
  ConsumerState<AddCustomerScreen> createState() => _AddCustomerScreenState();
}

class _AddCustomerScreenState extends ConsumerState<AddCustomerScreen> {
  final _formKey = GlobalKey<FormState>();
  
  String _type = 'Doctor';
  final _nameController = TextEditingController();
  final _specialtyController = TextEditingController();
  final _qualificationController = TextEditingController();
  final _mobileController = TextEditingController();
  final _addressController = TextEditingController();
  final _areaController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _pincodeController = TextEditingController();
  final _latController = TextEditingController();
  final _lngController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _specialtyController.dispose();
    _qualificationController.dispose();
    _mobileController.dispose();
    _addressController.dispose();
    _areaController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _pincodeController.dispose();
    _latController.dispose();
    _lngController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      final customer = CustomerModel(
        id: 'NEW_${DateTime.now().millisecondsSinceEpoch}',
        name: _nameController.text,
        type: _type,
        specialty: _type == 'Doctor' ? _specialtyController.text : null,
        qualification: _type == 'Doctor' ? _qualificationController.text : null,
        mobile: _mobileController.text,
        address: _addressController.text,
        area: _areaController.text,
        city: _cityController.text,
        state: _stateController.text,
        pincode: _pincodeController.text,
        latitude: double.tryParse(_latController.text),
        longitude: double.tryParse(_lngController.text),
        status: 'PENDING',
      );

      ref.read(addCustomerNotifierProvider.notifier).submitNewCustomer(customer);
    }
  }

  void _getCurrentLocation() {
    // Stub for getting current location
    setState(() {
      _latController.text = '37.7749';
      _lngController.text = '-122.4194';
    });
    AppFeedback.showSnackBar(context, 'Location captured successfully.');
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(addCustomerNotifierProvider, (previous, next) {
      if (!next.isLoading && next.hasValue) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Customer Added',
          message: 'The new customer has been submitted and is pending approval.',
          onOk: () {
            context.pop();
            context.pop(); // Go back
          },
        );
      } else if (next.hasError) {
        AppFeedback.showSnackBar(context, next.error.toString(), isError: true);
      }
    });

    final isLoading = ref.watch(addCustomerNotifierProvider).isLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Add New Customer')),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSizes.p24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                DropdownButtonFormField<String>(
                  value: _type,
                  decoration: const InputDecoration(labelText: 'Customer Type', border: OutlineInputBorder()),
                  items: ['Doctor', 'Chemist'].map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _type = v);
                  },
                ),
                AppSizes.gap16,
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(labelText: 'Name *', border: OutlineInputBorder()),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),
                if (_type == 'Doctor') ...[
                  AppSizes.gap16,
                  TextFormField(
                    controller: _specialtyController,
                    decoration: const InputDecoration(labelText: 'Specialty *', border: OutlineInputBorder()),
                    validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                  ),
                  AppSizes.gap16,
                  TextFormField(
                    controller: _qualificationController,
                    decoration: const InputDecoration(labelText: 'Qualification', border: OutlineInputBorder()),
                  ),
                ],
                AppSizes.gap16,
                TextFormField(
                  controller: _mobileController,
                  decoration: const InputDecoration(labelText: 'Mobile Number *', border: OutlineInputBorder()),
                  keyboardType: TextInputType.phone,
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),
                AppSizes.gap16,
                TextFormField(
                  controller: _addressController,
                  decoration: const InputDecoration(labelText: 'Address *', border: OutlineInputBorder()),
                  maxLines: 2,
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),
                AppSizes.gap16,
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _areaController,
                        decoration: const InputDecoration(labelText: 'Area *', border: OutlineInputBorder()),
                        validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                      ),
                    ),
                    AppSizes.gap16,
                    Expanded(
                      child: TextFormField(
                        controller: _cityController,
                        decoration: const InputDecoration(labelText: 'City *', border: OutlineInputBorder()),
                        validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                      ),
                    ),
                  ],
                ),
                AppSizes.gap16,
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _stateController,
                        decoration: const InputDecoration(labelText: 'State *', border: OutlineInputBorder()),
                        validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                      ),
                    ),
                    AppSizes.gap16,
                    Expanded(
                      child: TextFormField(
                        controller: _pincodeController,
                        decoration: const InputDecoration(labelText: 'Pincode *', border: OutlineInputBorder()),
                        validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                      ),
                    ),
                  ],
                ),
                AppSizes.gap24,
                const Text('Location Details', style: TextStyle(fontWeight: FontWeight.bold)),
                AppSizes.gap8,
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _latController,
                        decoration: const InputDecoration(labelText: 'Latitude', border: OutlineInputBorder()),
                        readOnly: true,
                        validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                      ),
                    ),
                    AppSizes.gap16,
                    Expanded(
                      child: TextFormField(
                        controller: _lngController,
                        decoration: const InputDecoration(labelText: 'Longitude', border: OutlineInputBorder()),
                        readOnly: true,
                        validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                      ),
                    ),
                  ],
                ),
                AppSizes.gap8,
                TextButton.icon(
                  onPressed: _getCurrentLocation,
                  icon: const Icon(Icons.my_location),
                  label: const Text('Capture Current Location'),
                ),
                AppSizes.gap32,
                isLoading 
                    ? const Center(child: CircularProgressIndicator())
                    : AppButton(
                        text: 'Submit for Approval',
                        onPressed: _submit,
                      ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
