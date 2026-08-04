import 'package:flutter/material.dart';

class TADAMatrixScreen extends StatelessWidget {
  const TADAMatrixScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('TA/DA Matrix Configuration')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildField('HQ DA (INR)', '250'),
          _buildField('Ex-HQ DA (INR)', '350'),
          _buildField('Outstation DA (INR)', '500'),
          _buildField('Transit DA (INR)', '400'),
          _buildField('TA Per KM (Two Wheeler - INR)', '3.50'),
          _buildField('TA Per KM (Four Wheeler - INR)', '8.00'),
          _buildField('Fixed Route TA (INR)', '150'),
          _buildField('Misc Expense Cap (INR/Month)', '2000'),
          const SizedBox(height: 24),
          ElevatedButton(onPressed: () {}, child: const Text('Save Configuration')),
        ],
      ),
    );
  }

  Widget _buildField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        initialValue: value,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
      ),
    );
  }
}
