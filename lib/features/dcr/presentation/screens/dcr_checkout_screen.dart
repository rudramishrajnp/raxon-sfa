import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:geolocator/geolocator.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/services/geofence_service.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/dcr_checkout_provider.dart';
import '../providers/dcr_checkout_state.dart';
import '../widgets/doctor_feedback_widget.dart';
import '../widgets/override_request_dialog.dart';

class DcrCheckOutScreen extends ConsumerStatefulWidget {
  final String checkInId;
  final String customerId;
  final String customerName;
  final double targetLat;
  final double targetLng;

  const DcrCheckOutScreen({
    super.key,
    required this.checkInId,
    required this.customerId,
    required this.customerName,
    required this.targetLat,
    required this.targetLng,
  });

  @override
  ConsumerState<DcrCheckOutScreen> createState() => _DcrCheckOutScreenState();
}

class _DcrCheckOutScreenState extends ConsumerState<DcrCheckOutScreen> {
  Position? _currentPosition;
  double? _distance;
  bool _isLoadingLocation = true;
  String? _locationError;

  String _callStatus = 'Completed';
  String? _doctorMood;
  String? _productInterest;
  String? _competitorActivity;
  String? _newOpportunity;
  String? _complaint;
  bool _followUpRequired = false;
  String? _nextVisitNotes;
  String? _remarks;

  Timer? _timeTimer;
  DateTime _currentTime = DateTime.now();

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(dcrCheckOutNotifierProvider.notifier).loadCheckOutData(widget.checkInId, widget.customerId));
    _fetchLocation();
    
    _timeTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() {
        _currentTime = DateTime.now();
      });
    });
  }

  @override
  void dispose() {
    _timeTimer?.cancel();
    super.dispose();
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
        _distance = ref.read(geofenceServiceProvider).getDistance(
          currentLat: position.latitude,
          currentLng: position.longitude,
          targetLat: widget.targetLat,
          targetLng: widget.targetLng,
        );
        _isLoadingLocation = false;
      });
    } catch (e) {
      setState(() {
        _locationError = 'Failed to get location: $e';
        _isLoadingLocation = false;
      });
    }
  }

  void _onCheckOutPressed(DateTime checkInTime) {
    if (_currentPosition == null) {
      AppFeedback.showSnackBar(context, 'Location is required for check-out.', isError: true);
      return;
    }
    
    ref.read(dcrCheckOutNotifierProvider.notifier).submitCheckOut(
      checkInId: widget.checkInId,
      customerId: widget.customerId,
      customerName: widget.customerName,
      checkInTime: checkInTime,
      targetLat: widget.targetLat,
      targetLng: widget.targetLng,
      callStatus: _callStatus,
      doctorMood: _doctorMood,
      productInterest: _productInterest,
      competitorActivity: _competitorActivity,
      newOpportunity: _newOpportunity,
      complaint: _complaint,
      followUpRequired: _followUpRequired,
      nextVisitNotes: _nextVisitNotes,
      remarks: _remarks,
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(dcrCheckOutNotifierProvider, (previous, next) {
      if (next is DcrCheckOutSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Check-out Successful',
          message: next.message,
          onOk: () {
            context.pop(); // Close dialog
            context.pushReplacement('/dcr-summary', extra: {
              'checkInId': widget.checkInId,
              'customerId': widget.customerId,
              'customerName': widget.customerName,
            });
          },
        );
      } else if (next is DcrCheckOutError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      } else if (next is DcrCheckOutLocationError) {
        _showLocationErrorDialog(next.message);
      }
    });

    final state = ref.watch(dcrCheckOutNotifierProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Check-Out')),
      body: SafeArea(
        child: _buildBody(state),
      ),
    );
  }

  Widget _buildBody(DcrCheckOutState state) {
    if (state is DcrCheckOutInitial || state is DcrCheckOutLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    
    if (state is DcrCheckOutLoaded) {
      final checkInTime = state.checkInTime;
      final duration = _currentTime.difference(checkInTime);
      final durationStr = '${duration.inHours}h ${duration.inMinutes.remainder(60)}m ${duration.inSeconds.remainder(60)}s';
      
      final report = state.report;
      final totalSamples = report?.samples.fold(0, (sum, i) => sum! + i.quantity) ?? 0;
      final totalOrders = report?.orders.fold(0, (sum, i) => sum! + i.quantity) ?? 0;

      return SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.p24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(widget.customerName, style: AppTypography.headlineSmall.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap16,
            
            Card(
              elevation: 0,
              color: AppColors.primary.withOpacity(0.05),
              child: Padding(
                padding: const EdgeInsets.all(AppSizes.p16),
                child: Column(
                  children: [
                    _buildTimeRow('Check-in Time', DateFormat('hh:mm:ss a').format(checkInTime)),
                    AppSizes.gap8,
                    _buildTimeRow('Current Time', DateFormat('hh:mm:ss a').format(_currentTime)),
                    const Divider(height: 24),
                    _buildTimeRow('Visit Duration', durationStr, isBold: true),
                  ],
                ),
              ),
            ),
            AppSizes.gap24,

            Text('DCR Report Summary', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap8,
            Card(
              elevation: 0,
              color: AppColors.surface,
              child: Padding(
                padding: const EdgeInsets.all(AppSizes.p16),
                child: Column(
                  children: [
                    _buildInfoRow('Samples Given', '$totalSamples items'),
                    AppSizes.gap8,
                    _buildInfoRow('Orders Booked', '$totalOrders items'),
                    AppSizes.gap8,
                    _buildInfoRow('Prescription', report?.prescription?.doctorType ?? 'Not filled'),
                  ],
                ),
              ),
            ),
            AppSizes.gap24,

            _buildLocationCard(),
            AppSizes.gap24,

            Text('Call Feedback', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap8,
            DoctorFeedbackWidget(
              onFeedbackChanged: ({
                required callStatus,
                doctorMood,
                productInterest,
                competitorActivity,
                newOpportunity,
                complaint,
                required followUpRequired,
                nextVisitNotes,
                remarks,
              }) {
                _callStatus = callStatus;
                _doctorMood = doctorMood;
                _productInterest = productInterest;
                _competitorActivity = competitorActivity;
                _newOpportunity = newOpportunity;
                _complaint = complaint;
                _followUpRequired = followUpRequired;
                _nextVisitNotes = nextVisitNotes;
                _remarks = remarks;
              },
            ),
            
            AppSizes.gap32,
            AppButton(
              text: 'Complete Check-Out',
              onPressed: _currentPosition != null ? () => _onCheckOutPressed(checkInTime) : null,
            ),
          ],
        ),
      );
    }

    return const SizedBox.shrink();
  }

  Widget _buildTimeRow(String label, String value, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.bodyMedium),
        Text(
          value,
          style: AppTypography.bodyMedium.copyWith(
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            color: isBold ? AppColors.primary : AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.bodyMedium),
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildLocationCard() {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        side: BorderSide(color: Colors.grey.shade300),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('GPS Status', style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.bold)),
                IconButton(
                  icon: const Icon(Icons.refresh, size: 20),
                  onPressed: _fetchLocation,
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
            AppSizes.gap8,
            if (_isLoadingLocation)
              const Center(child: CircularProgressIndicator(strokeWidth: 2))
            else if (_locationError != null)
              Text(_locationError!, style: TextStyle(color: AppColors.error))
            else if (_currentPosition != null) ...[
              _buildInfoRow('GPS Accuracy', '${_currentPosition!.accuracy.toStringAsFixed(1)} m'),
              AppSizes.gap4,
              if (_distance != null)
                _buildInfoRow(
                  'Distance to Target',
                  '${_distance!.toStringAsFixed(1)} m',
                )
            ],
          ],
        ),
      ),
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
                    customerId: widget.customerId,
                    targetLat: widget.targetLat,
                    targetLng: widget.targetLng,
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
