import 'package:flutter/material.dart';

class CompanyEditScreen extends StatefulWidget {
  final String? companyId;
  const CompanyEditScreen({super.key, this.companyId});

  @override
  State<CompanyEditScreen> createState() => _CompanyEditScreenState();
}

class _CompanyEditScreenState extends State<CompanyEditScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final List<String> _selectedModules = ['dcr', 'expense', 'mtp'];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.companyId == null ? 'Add Company' : 'Edit Company'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Company Name'),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Admin Email'),
              ),
              const SizedBox(height: 16),
              const Text('Modules', style: TextStyle(fontWeight: FontWeight.bold)),
              Wrap(
                spacing: 8,
                children: ['DCR', 'Expense', 'MTP', 'Secondary Sales'].map<Widget>((module) {
                  final isSelected = _selectedModules.contains(module.toLowerCase());
                  return FilterChip(
                    label: Text(module),
                    selected: isSelected,
                    selectedColor: Colors.indigo.shade100,
                    onSelected: (bool selected) {
                      setState(() {
                        if (selected) {
                          _selectedModules.add(module.toLowerCase());
                        } else {
                          _selectedModules.remove(module.toLowerCase());
                        }
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState?.validate() ?? false) {
                    Navigator.of(context).pop();
                  }
                },
                child: const Text('Save Company'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
