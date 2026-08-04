import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/team_tracking_models.dart';

class TrackingTimeline extends StatelessWidget {
  final List<TrackingEventModel> events;

  const TrackingTimeline({super.key, required this.events});

  @override
  Widget build(BuildContext context) {
    if (events.isEmpty) {
      return Center(
        child: Text('No activity found for this date.', style: AppTypography.bodyMedium),
      );
    }
    
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: events.length,
      itemBuilder: (context, index) {
        final event = events[index];
        final isLast = index == events.length - 1;
        return _buildTimelineRow(event, isLast);
      },
    );
  }

  Widget _buildTimelineRow(TrackingEventModel event, bool isLast) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            width: 60,
            child: Text(
              DateFormat('HH:mm').format(event.timestamp),
              style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.bold, color: AppColors.grey700),
              textAlign: TextAlign.right,
            ),
          ),
          AppSizes.gap12,
          Column(
            children: [
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  color: _getEventColor(event.eventType),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.surface, width: 2),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: AppColors.grey300,
                  ),
                ),
            ],
          ),
          AppSizes.gap12,
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: AppSizes.p24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(event.eventType, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
                  if (event.customerName != null) ...[
                    AppSizes.gap4,
                    Text('Customer: ${event.customerName}', style: AppTypography.bodySmall),
                  ],
                  if (event.locationName != null) ...[
                    AppSizes.gap4,
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.location_on, size: 14, color: AppColors.grey500),
                        AppSizes.gap4,
                        Expanded(
                          child: Text(
                            event.locationName!,
                            style: AppTypography.bodySmall.copyWith(color: AppColors.grey600),
                          ),
                        ),
                      ],
                    ),
                  ],
                  AppSizes.gap4,
                  Text(
                    'Status: ${event.status}',
                    style: AppTypography.bodySmall.copyWith(
                      color: event.status == 'Completed' ? AppColors.success : AppColors.warning,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _getEventColor(String type) {
    if (type.contains('Punch In')) return AppColors.success;
    if (type.contains('Punch Out')) return AppColors.error;
    if (type.contains('Check-In')) return Colors.blue;
    if (type.contains('Order')) return Colors.purple;
    if (type.contains('Expense')) return Colors.orange;
    return AppColors.grey500;
  }
}
