import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/team_tracking_models.dart';
import '../providers/route_movement_provider.dart';
import '../widgets/tracking_timeline.dart';

class TeamRouteScreen extends ConsumerStatefulWidget {
  final TeamMemberLocationModel member;

  const TeamRouteScreen({super.key, required this.member});

  @override
  ConsumerState<TeamRouteScreen> createState() => _TeamRouteScreenState();
}

class _TeamRouteScreenState extends ConsumerState<TeamRouteScreen> {
  DateTime _selectedDate = DateTime.now();
  GoogleMapController? _mapController;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(routeMovementNotifierProvider(widget.member.id).notifier).loadRoute(widget.member.id, _selectedDate);
    });
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
  }

  Future<void> _selectDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
      ref.read(routeMovementNotifierProvider(widget.member.id).notifier).loadRoute(widget.member.id, _selectedDate);
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(routeMovementNotifierProvider(widget.member.id));

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.member.name, style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
            Text('Route Movement', style: AppTypography.bodySmall.copyWith(color: AppColors.onPrimary.withOpacity(0.8))),
          ],
        ),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
        actions: [
          TextButton.icon(
            onPressed: () => _selectDate(context),
            icon: const Icon(Icons.calendar_today, color: AppColors.onPrimary, size: 18),
            label: Text(
              DateFormat('dd MMM').format(_selectedDate),
              style: AppTypography.bodyMedium.copyWith(color: AppColors.onPrimary),
            ),
          ),
        ],
      ),
      body: _buildBody(state),
    );
  }

  Widget _buildBody(RouteMovementState state) {
    if (state is RouteMovementLoading) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is RouteMovementError) {
      return Center(
        child: Text(state.message, style: AppTypography.bodyMedium.copyWith(color: AppColors.error)),
      );
    } else if (state is RouteMovementLoaded) {
      final events = state.events;
      final markers = _createMarkers(events);
      final polylines = _createPolylines(events);
      
      // Default location (e.g. India center) if no data
      var initialPos = const CameraPosition(target: LatLng(20.5937, 78.9629), zoom: 4);
      if (events.isNotEmpty && events.first.latitude != null && events.first.longitude != null) {
        initialPos = CameraPosition(
          target: LatLng(events.first.latitude!, events.first.longitude!),
          zoom: 12,
        );
      } else if (widget.member.latitude != null && widget.member.longitude != null) {
        initialPos = CameraPosition(
          target: LatLng(widget.member.latitude!, widget.member.longitude!),
          zoom: 12,
        );
      }

      return Column(
        children: [
          // Top Map View
          SizedBox(
            height: 300,
            child: Stack(
              children: [
                GoogleMap(
                  onMapCreated: _onMapCreated,
                  initialCameraPosition: initialPos,
                  markers: markers,
                  polylines: polylines,
                  myLocationEnabled: false,
                  zoomControlsEnabled: false,
                ),
                // Overlay for live status if checking today
                if (_isToday(_selectedDate))
                  Positioned(
                    top: 16,
                    left: 16,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.all(AppSizes.p12),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(AppSizes.radius8),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 12,
                                height: 12,
                                decoration: BoxDecoration(
                                  color: widget.member.isOnline ? AppColors.success : AppColors.error,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              AppSizes.gap8,
                              Text(widget.member.currentStatus, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
                            ],
                          ),
                          Text(
                            'Last GPS: ${DateFormat('hh:mm a').format(widget.member.lastGpsTime)}',
                            style: AppTypography.bodySmall.copyWith(color: AppColors.grey600),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
          // Bottom Timeline
          Expanded(
            child: Container(
              color: AppColors.surface,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppSizes.p24),
                child: TrackingTimeline(events: events),
              ),
            ),
          ),
        ],
      );
    }
    return const SizedBox.shrink();
  }

  bool _isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year && date.month == now.month && date.day == now.day;
  }

  Set<Marker> _createMarkers(List<TrackingEventModel> events) {
    final markers = <Marker>{};
    for (int i = 0; i < events.length; i++) {
      final event = events[i];
      if (event.latitude != null && event.longitude != null) {
        markers.add(
          Marker(
            markerId: MarkerId('event_$i'),
            position: LatLng(event.latitude!, event.longitude!),
            infoWindow: InfoWindow(
              title: event.eventType,
              snippet: event.locationName ?? DateFormat('hh:mm a').format(event.timestamp),
            ),
            icon: _getMarkerIcon(event.eventType),
          ),
        );
      }
    }
    
    // Add current live position if viewing today
    if (_isToday(_selectedDate) && widget.member.latitude != null && widget.member.longitude != null) {
      markers.add(
        Marker(
          markerId: const MarkerId('current_location'),
          position: LatLng(widget.member.latitude!, widget.member.longitude!),
          infoWindow: const InfoWindow(title: 'Current Location'),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
        ),
      );
    }
    
    return markers;
  }

  Set<Polyline> _createPolylines(List<TrackingEventModel> events) {
    final points = <LatLng>[];
    for (final event in events) {
      if (event.latitude != null && event.longitude != null) {
        points.add(LatLng(event.latitude!, event.longitude!));
      }
    }
    
    // Add current live position to path if today
    if (_isToday(_selectedDate) && widget.member.latitude != null && widget.member.longitude != null) {
      points.add(LatLng(widget.member.latitude!, widget.member.longitude!));
    }

    if (points.length < 2) return {};

    return {
      Polyline(
        polylineId: const PolylineId('route'),
        points: points,
        color: AppColors.primary,
        width: 4,
      ),
    };
  }

  BitmapDescriptor _getMarkerIcon(String type) {
    // In a real app, load custom marker icons (BitmapDescriptor.fromAssetImage)
    // For now using default markers with different hues
    if (type.contains('Punch In')) return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen);
    if (type.contains('Punch Out')) return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed);
    if (type.contains('Order')) return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueViolet);
    return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure);
  }
}
