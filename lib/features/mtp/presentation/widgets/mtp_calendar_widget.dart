import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/mtp_models.dart';

class MtpCalendarWidget extends StatelessWidget {
  final int month;
  final int year;
  final List<MtpDayModel> plannedDays;
  final Function(DateTime, MtpDayModel?) onDayTap;

  const MtpCalendarWidget({
    super.key,
    required this.month,
    required this.year,
    required this.plannedDays,
    required this.onDayTap,
  });

  @override
  Widget build(BuildContext context) {
    final daysInMonth = DateTime(year, month + 1, 0).day;
    final firstDayOfWeek = DateTime(year, month, 1).weekday; // 1 = Monday, 7 = Sunday
    
    // Adjust so Sunday is the first column if desired. Let's keep Monday as first for business apps, or standard Sunday.
    // For simplicity, let's just use a simple grid based on days.
    
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 7, // 7 days a week
        childAspectRatio: 0.8,
        crossAxisSpacing: 4,
        mainAxisSpacing: 4,
      ),
      // Adding empty slots for days before the 1st
      itemCount: daysInMonth + (firstDayOfWeek - 1), 
      itemBuilder: (context, index) {
        if (index < firstDayOfWeek - 1) {
          return const SizedBox.shrink(); // Empty slots
        }

        final dayNumber = index - (firstDayOfWeek - 1) + 1;
        final currentDate = DateTime(year, month, dayNumber);
        
        final planForDay = plannedDays.cast<MtpDayModel?>().firstWhere(
          (d) => d != null && d.date.day == dayNumber && d.date.month == month && d.date.year == year,
          orElse: () => null,
        );

        final hasPlan = planForDay != null && planForDay.workType.isNotEmpty;
        final isLeave = hasPlan && planForDay.workType == 'Leave';
        
        Color bgColor = Colors.transparent;
        if (isLeave) {
          bgColor = AppColors.warning.withOpacity(0.2);
        } else if (hasPlan) {
          bgColor = AppColors.primary.withOpacity(0.1);
        }

        return InkWell(
          onTap: () => onDayTap(currentDate, planForDay),
          borderRadius: BorderRadius.circular(AppSizes.radius8),
          child: Container(
            decoration: BoxDecoration(
              color: bgColor,
              border: Border.all(
                color: hasPlan ? AppColors.primary.withOpacity(0.5) : AppColors.grey300,
              ),
              borderRadius: BorderRadius.circular(AppSizes.radius8),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  dayNumber.toString(),
                  style: AppTypography.bodyMedium.copyWith(
                    fontWeight: FontWeight.bold,
                    color: currentDate.weekday == 7 ? AppColors.error : AppColors.textPrimary,
                  ),
                ),
                if (hasPlan && !isLeave)
                  Padding(
                    padding: const EdgeInsets.only(top: 2.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.people, size: 10, color: AppColors.primary),
                        const SizedBox(width: 2),
                        Text('${planForDay.doctors.length}', style: const TextStyle(fontSize: 10, color: AppColors.primary)),
                      ],
                    ),
                  ),
                if (isLeave)
                  const Padding(
                    padding: EdgeInsets.only(top: 2.0),
                    child: Text('L', style: TextStyle(fontSize: 10, color: AppColors.warning, fontWeight: FontWeight.bold)),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }
}
