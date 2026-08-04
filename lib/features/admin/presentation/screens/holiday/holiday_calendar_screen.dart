import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/holiday_broadcast_providers.dart';

class HolidayCalendarScreen extends ConsumerStatefulWidget {
  const HolidayCalendarScreen({super.key});

  @override
  ConsumerState<HolidayCalendarScreen> createState() => _HolidayCalendarScreenState();
}

class _HolidayCalendarScreenState extends ConsumerState<HolidayCalendarScreen> {
  @override
  Widget build(BuildContext context) {
    final holidaysAsync = ref.watch(holidaysProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Holiday Calendar'),
      ),
      body: holidaysAsync.when(
        data: (holidays) {
          if (holidays.isEmpty) return const Center(child: Text('No holidays found.'));
          return ListView.builder(
            itemCount: holidays.length,
            itemBuilder: (context, index) {
              final h = holidays[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: const Icon(Icons.event, color: Colors.blue),
                  title: Text(h.name),
                  subtitle: Text('${DateFormat('dd-MMM-yyyy').format(h.date)} | ${h.type}'),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
