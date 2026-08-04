import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:geolocator/geolocator.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/services/geofence_service.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../../../work_plan/data/models/customer_model.dart';
import '../providers/dcr_checkin_provider.dart';
import '../providers/dcr_checkin_state.dart';
import '../widgets/override_request_dialog.dart';

class DcrCheckInScreen extends ConsumerStatefulWidget {
  final CustomerModel customer;

  const DcrCheckInScreen({super.key, required this.customer});

  @override
  ConsumerState<DcrCheckInScreen> createState() => _DcrCheckInScreenState();
}

class _DcrCheckInScreenState extends ConsumerState<DcrCheckInScreen> {
  Position? _currentPosition;
  double? _distance;
  bool _isLoadingLocation = true;
  String? _locationError;

  @override
  void initState() {
    super.initState();
    _fetchLocation();
  }

  Future<void> _fetchLocation() async {
    setState(() {
      _isLoadingLocation = true;
      _locationError = null;
    });

    try {
      final locationService = ref.read(locationServiceProvider);
      final isEnabled = await locationService.isLocationServiceEnabled();
      if (!isEnabled) {
        setState(() {
          _locationError = 'GPS is disabled.';
          _isLoadingLocation = false;
        });
        return;
      }

      final position = await locationService.getCurrentPosition();
      setState(() {
        _currentPosition = position;
        if (widget.customer.latitude != null && widget.customer.longitude != null) {
          _distance = ref.read(geofenceServiceProvider).getDistance(
            currentLat: position.latitude,
            currentLng: position.longitude,
            targetLat: widget.customer.latitude!,
            targetLng: widget.customer.longitude!,
          );
        }
        _isLoadingLocation = false;
      });
    } catch (e) {
      setState(() {
        _locationError = 'Failed to get location: $e';
        _isLoadingLocation = false;
      });
    }
  }

  void _onCheckInPressed() {
    if (widget.customer.latitude == null || widget.customer.longitude == null) {
      AppFeedback.showSnackBar(context, 'Customer location is unknown. Cannot verify geofence.', isError: true);
      return;
    }
    
    ref.read(dcrCheckInNotifierProvider.notifier).submitCheckIn(
      widget.customer.id, 
      widget.customer.latitude!, 
      widget.customer.longitude!,
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(dcrCheckInNotifierProvider, (previous, next) {
      if (next is DcrCheckInSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Success',
          message: next.message,
          onOk: () {
            context.pop(); // Close dialog
            context.pushReplacement('/dcr-report', extra: {
              'checkInId': 'CHECKIN_${DateTime.now().millisecondsSinceEpoch}',
              'customerId': widget.customer.id,
            });
          },
        );
      } else if (next is DcrCheckInError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      } else if (next is DcrLocationError) {
        _showLocationErrorDialog(next.message);
      }
    });

    final state = ref.watch(dcrCheckInNotifierProvider);
    final isLoading = state is DcrCheckInLoading || _isLoadingLocation;

    return Scaffold(
      appBar: AppBar(title: const Text('Check-In')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSizes.p24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildCustomerCard(),
              AppSizes.gap24,
              _buildLocationCard(),
              AppSizes.gap32,
              if (isLoading)
                const Center(child: CircularProgressIndicator())
              else
                AppButton(
                  text: 'Check-In',
                  onPressed: _currentPosition != null ? _onCheckInPressed : null,
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCustomerCard() {
    return Card(
      elevation: 0,
      color: AppColors.primary.withOpacity(0.05),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSizes.radius16),
        side: BorderSide(color: AppColors.primary.withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    widget.customer.name,
                    style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: AppSizes.p8, vertical: AppSizes.p4),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(AppSizes.radius8),
                  ),
                  child: Text(
                    widget.customer.type,
                    style: AppTypography.labelSmall.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            if (widget.customer.specialty != null) ...[
              AppSizes.gap8,
              Text('${widget.customer.specialty} | Class: ${widget.customer.classification ?? 'N/A'}', style: AppTypography.bodyMedium),
            ],
            AppSizes.gap16,
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.location_on, size: 20, color: AppColors.textSecondary),
                AppSizes.gap8,
                Expanded(
                  child: Text(widget.customer.address ?? 'Address not available', style: AppTypography.bodyMedium),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLocationCard() {
    return Card(
      elevation: 0,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppSizes.radius16)),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('GPS Status', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
                IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: _fetchLocation,
                  tooltip: 'Refresh Location',
                ),
              ],
            ),
            const Divider(),
            if (_isLoadingLocation)
              const Padding(
                padding: EdgeInsets.all(AppSizes.p16),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (_locationError != null)
              Padding(
                padding: const EdgeInsets.all(AppSizes.p16),
                child: Text(_locationError!, style: TextStyle(color: AppColors.error)),
              )
            else if (_currentPosition != null) ...[
              AppSizes.gap8,
              _buildInfoRow('Current Lat:', _currentPosition!.latitude.toStringAsFixed(6)),
              AppSizes.gap8,
              _buildInfoRow('Current Lng:', _currentPosition!.longitude.toStringAsFixed(6)),
              AppSizes.gap8,
              _buildInfoRow('GPS Accuracy:', '${_currentPosition!.accuracy.toStringAsFixed(1)} m'),
              AppSizes.gap8,
              if (_distance != null)
                _buildInfoRow(
                  'Distance to Target:',
                  '${_distance!.toStringAsFixed(1)} m',
                  color: _distance! <= GeofenceService.defaultRadiusMeters ? AppColors.success : AppColors.error,
                )
              else
                _buildInfoRow('Distance to Target:', 'Target location unknown', color: AppColors.error),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {Color? color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary)),
        Text(
          value,
          style: AppTypography.bodyMedium.copyWith(
            fontWeight: FontWeight.bold,
            color: color ?? AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  void _showLocationErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Location Error'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                _fetchLocation();
              },
              child: const Text('Retry GPS'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                showDialog(
                  context: context,
                  builder: (_) => OverrideRequestDialog(
                    customerId: widget.customer.id,
                    targetLat: widget.customer.latitude ?? 0.0,
                    targetLng: widget.customer.longitude ?? 0.0,
                  ),
                );
              },
              child: const Text('Request Override'),
            ),
          ],
        );
      },
    );
  }
}
