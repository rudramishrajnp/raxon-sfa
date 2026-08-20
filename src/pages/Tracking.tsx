import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  User, 
  Clock, 
  Users, 
  Pill, 
  Gift, 
  ShoppingCart, 
  MessageSquare, 
  Eye, 
  Calendar, 
  Filter, 
  Building2, 
  IndianRupee,
  Shield,
  Search,
  Phone,
  Battery,
  ChevronRight,
  ChevronLeft,
  Route,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { getAllTeamDCRVisits } from '../lib/api';
import { Modal } from '../components/Modal';
import { getUsersByCompany, getLoggedInUser } from '../data/userContext';
import { getActiveCompanyId } from '../data/companyContext';

export interface MRTrackProfile {
  id: number;
  empId: string;
  name: string;
  role: string;
  hq: string;
  phone: string;
  status: 'Active' | 'On Break' | 'Inactive';
  battery: number;
  speed: string;
  totalDistanceKm: number;
  punchInTime: string;
  lastPingTime: string;
  plannedPatch: string;
  currentLocationName: string;
  coords: { lat: number; lng: number; str: string };
  pobToday: number;
  callsDone: number;
  totalPlannedCalls: number;
  waypoints: {
    id: number;
    type: 'start' | 'doctor' | 'chemist' | 'current';
    time: string;
    title: string;
    subtitle: string;
    lat: number;
    lng: number;
    status: 'completed' | 'in_progress' | 'planned';
    distanceFromPrev: string;
    pob?: number;
    samples?: number;
    feedback?: string;
    isJointWithManager?: boolean;
    managerName?: string;
    accuracy?: string;
  }[];
}

const TEAM_MEMBERS_TRACKING: MRTrackProfile[] = [
  {
    id: 1,
    empId: 'EMP-1001',
    name: 'Pradeep Mishra (Default)',
    role: 'Medical Representative (MR)',
    hq: 'Akbarpur HQ',
    phone: '+91 98765 43210',
    status: 'Active',
    battery: 88,
    speed: '16 km/h (Bike)',
    totalDistanceKm: 14.8,
    punchInTime: '09:15 AM',
    lastPingTime: '1 min ago',
    plannedPatch: 'Iltifatganj',
    currentLocationName: 'Near Katra Chauraha, Iltifatganj',
    coords: { lat: 26.4300, lng: 82.5400, str: '26.4300° N, 82.5400° E' },
    pobToday: 10400,
    callsDone: 5,
    totalPlannedCalls: 8,
    waypoints: [
      {
        id: 1,
        type: 'start',
        time: '09:15 AM',
        title: 'Morning Duty Punch-In',
        subtitle: 'Patel Nagar Residence / Akbarpur Hub',
        lat: 26.4250,
        lng: 82.5350,
        status: 'completed',
        distanceFromPrev: '0.0 km',
        accuracy: 'GPS Lock 8m'
      },
      {
        id: 2,
        type: 'doctor',
        time: '10:05 AM',
        title: 'Dr. Mohd. Tariq (General Physician)',
        subtitle: 'Main Bazar Chowk, Iltifatganj',
        lat: 26.4280,
        lng: 82.5385,
        status: 'completed',
        distanceFromPrev: '3.4 km',
        pob: 3200,
        samples: 4,
        feedback: 'Prescribing Raxon-CV 625 actively',
        isJointWithManager: true,
        managerName: 'Rahul Sharma (AM)',
        accuracy: 'Geo-Verified 12m'
      },
      {
        id: 3,
        type: 'doctor',
        time: '11:15 AM',
        title: 'Dr. Shailendra Verma (Pediatrician)',
        subtitle: 'Thana Road, Iltifatganj',
        lat: 26.4295,
        lng: 82.5392,
        status: 'completed',
        distanceFromPrev: '2.1 km',
        samples: 6,
        feedback: 'Interested in Raxoclav Dry Syrup',
        accuracy: 'Geo-Verified 9m'
      },
      {
        id: 4,
        type: 'chemist',
        time: '12:20 PM',
        title: 'Mishra Medical Hall (Chemist Order)',
        subtitle: 'Main Bazar, Iltifatganj',
        lat: 26.4302,
        lng: 82.5405,
        status: 'completed',
        distanceFromPrev: '1.2 km',
        pob: 5400,
        feedback: 'Stockist POB order booked for Raxon-CV & Raxodil',
        accuracy: 'Geo-Verified 14m'
      },
      {
        id: 5,
        type: 'doctor',
        time: '01:45 PM',
        title: 'Dr. Asif Khan (Consultant Physician)',
        subtitle: 'Kasba Hospital Mod, Iltifatganj',
        lat: 26.4312,
        lng: 82.5415,
        status: 'completed',
        distanceFromPrev: '2.8 km',
        pob: 1800,
        samples: 3,
        feedback: 'Good Rx support for GlyciRax-M',
        isJointWithManager: true,
        managerName: 'Rahul Sharma (AM)',
        accuracy: 'Geo-Verified 11m'
      },
      {
        id: 6,
        type: 'current',
        time: 'Live Now',
        title: 'Current Live GPS Position',
        subtitle: 'Near Katra Chauraha, Iltifatganj',
        lat: 26.4300,
        lng: 82.5400,
        status: 'in_progress',
        distanceFromPrev: '1.5 km',
        accuracy: 'Active GPS Ping (4G)'
      }
    ]
  },
  {
    id: 2,
    empId: 'EMP-1002',
    name: 'Rahul Singh (Default)',
    role: 'Medical Representative (MR)',
    hq: 'Faizabad / Ayodhya HQ',
    phone: '+91 98765 43211',
    status: 'Active',
    battery: 74,
    speed: '0 km/h (At Clinic)',
    totalDistanceKm: 11.2,
    punchInTime: '09:30 AM',
    lastPingTime: 'Just now',
    plannedPatch: 'Civil Lines Ayodhya',
    currentLocationName: 'Near District Hospital Chauraha, Civil Lines',
    coords: { lat: 26.7725, lng: 82.1460, str: '26.7725° N, 82.1460° E' },
    pobToday: 7800,
    callsDone: 4,
    totalPlannedCalls: 7,
    waypoints: [
      {
        id: 1,
        type: 'start',
        time: '09:30 AM',
        title: 'Morning Duty Punch-In',
        subtitle: 'Rikabganj Main Road',
        lat: 26.7680,
        lng: 82.1400,
        status: 'completed',
        distanceFromPrev: '0.0 km',
        accuracy: 'GPS Lock 10m'
      },
      {
        id: 2,
        type: 'doctor',
        time: '10:20 AM',
        title: 'Dr. K.P. Maurya (Cardiologist)',
        subtitle: 'Civil Lines, Opp. SBI Zonal Office',
        lat: 26.7710,
        lng: 82.1440,
        status: 'completed',
        distanceFromPrev: '3.1 km',
        pob: 4500,
        samples: 5,
        feedback: 'CardioRax-AM regular prescriber',
        accuracy: 'Geo-Verified 7m'
      },
      {
        id: 3,
        type: 'doctor',
        time: '11:40 AM',
        title: 'Dr. Meena Agarwal (Gynecologist)',
        subtitle: 'Near Court Mod, Civil Lines',
        lat: 26.7720,
        lng: 82.1450,
        status: 'completed',
        distanceFromPrev: '1.8 km',
        samples: 4,
        pob: 3300,
        feedback: 'Requested RaxoCal-D3 samples',
        accuracy: 'Geo-Verified 11m'
      },
      {
        id: 4,
        type: 'current',
        time: 'Live Now',
        title: 'Current Live GPS Position',
        subtitle: 'Inside Agarwal Polyclinic, Civil Lines',
        lat: 26.7725,
        lng: 82.1460,
        status: 'in_progress',
        distanceFromPrev: '0.9 km',
        accuracy: 'Stationary (In-Clinic)'
      }
    ]
  },
  {
    id: 3,
    empId: 'EMP-1005',
    name: 'Amit Singh',
    role: 'Medical Representative (MR)',
    hq: 'Varanasi HQ',
    phone: '+91 98765 43214',
    status: 'Active',
    battery: 92,
    speed: '22 km/h (Bike)',
    totalDistanceKm: 18.6,
    punchInTime: '09:00 AM',
    lastPingTime: '3 mins ago',
    plannedPatch: 'Lanka / BHU Gate',
    currentLocationName: 'Near Trauma Center Mod, Lanka',
    coords: { lat: 25.2810, lng: 82.9980, str: '25.2810° N, 82.9980° E' },
    pobToday: 14200,
    callsDone: 6,
    totalPlannedCalls: 8,
    waypoints: [
      {
        id: 1,
        type: 'start',
        time: '09:00 AM',
        title: 'Morning Duty Punch-In',
        subtitle: 'Sigra Main Road, Varanasi',
        lat: 25.3120,
        lng: 82.9860,
        status: 'completed',
        distanceFromPrev: '0.0 km',
        accuracy: 'GPS Lock 6m'
      },
      {
        id: 2,
        type: 'doctor',
        time: '10:00 AM',
        title: 'Dr. Rajesh Tripathi (Physician)',
        subtitle: 'Bhelupur Chauraha, Varanasi',
        lat: 25.2980,
        lng: 82.9910,
        status: 'completed',
        distanceFromPrev: '4.2 km',
        pob: 6200,
        samples: 6,
        isJointWithManager: true,
        managerName: 'R.K. Tiwari (RM)',
        accuracy: 'Geo-Verified 8m'
      },
      {
        id: 3,
        type: 'chemist',
        time: '11:15 AM',
        title: 'Kashi Medicos (Retail Chemist)',
        subtitle: 'Lanka Gate, Varanasi',
        lat: 25.2825,
        lng: 82.9970,
        status: 'completed',
        distanceFromPrev: '3.5 km',
        pob: 8000,
        accuracy: 'Geo-Verified 12m'
      },
      {
        id: 4,
        type: 'current',
        time: 'Live Now',
        title: 'Current Live GPS Position',
        subtitle: 'Trauma Center Mod, Lanka Road',
        lat: 25.2810,
        lng: 82.9980,
        status: 'in_progress',
        distanceFromPrev: '2.1 km',
        accuracy: 'Active GPS Ping (5G)'
      }
    ]
  },
  {
    id: 4,
    empId: 'EMP-1004',
    name: 'Sumit Verma',
    role: 'Medical Representative (MR)',
    hq: 'Kanpur HQ',
    phone: '+91 98765 43213',
    status: 'On Break',
    battery: 62,
    speed: '0 km/h (Lunch Break)',
    totalDistanceKm: 8.4,
    punchInTime: '09:45 AM',
    lastPingTime: '12 mins ago',
    plannedPatch: 'Swaroop Nagar',
    currentLocationName: 'Swaroop Nagar Market, Near Haldiram',
    coords: { lat: 26.4780, lng: 80.3210, str: '26.4780° N, 80.3210° E' },
    pobToday: 4500,
    callsDone: 3,
    totalPlannedCalls: 6,
    waypoints: [
      {
        id: 1,
        type: 'start',
        time: '09:45 AM',
        title: 'Morning Duty Punch-In',
        subtitle: 'Civil Lines Kanpur',
        lat: 26.4710,
        lng: 80.3450,
        status: 'completed',
        distanceFromPrev: '0.0 km',
        accuracy: 'GPS Lock 15m'
      },
      {
        id: 2,
        type: 'doctor',
        time: '11:00 AM',
        title: 'Dr. Vivek Saxena (Diabetologist)',
        subtitle: 'Swaroop Nagar Medical Center',
        lat: 26.4760,
        lng: 80.3260,
        status: 'completed',
        distanceFromPrev: '4.8 km',
        pob: 4500,
        samples: 4,
        accuracy: 'Geo-Verified 10m'
      },
      {
        id: 3,
        type: 'current',
        time: 'Live Now',
        title: 'Current Live GPS Position (On Field Lunch)',
        subtitle: 'Swaroop Nagar Market, Kanpur',
        lat: 26.4780,
        lng: 80.3210,
        status: 'in_progress',
        distanceFromPrev: '1.2 km',
        accuracy: 'Stationary (Lunch Break)'
      }
    ]
  },
  {
    id: 5,
    empId: 'EMP-1007',
    name: 'Vikram Seth',
    role: 'Medical Representative (MR)',
    hq: 'Lucknow HQ',
    phone: '+91 98765 43215',
    status: 'Active',
    battery: 95,
    speed: '12 km/h (Bike)',
    totalDistanceKm: 21.4,
    punchInTime: '09:00 AM',
    lastPingTime: 'Just now',
    plannedPatch: 'Gomti Nagar',
    currentLocationName: 'Near Patrakarpuram Crossing, Gomti Nagar',
    coords: { lat: 26.8520, lng: 80.9980, str: '26.8520° N, 80.9980° E' },
    pobToday: 18900,
    callsDone: 7,
    totalPlannedCalls: 9,
    waypoints: [
      {
        id: 1,
        type: 'start',
        time: '09:00 AM',
        title: 'Morning Duty Punch-In',
        subtitle: 'Hazratganj Main Office',
        lat: 26.8467,
        lng: 80.9462,
        status: 'completed',
        distanceFromPrev: '0.0 km',
        accuracy: 'GPS Lock 5m'
      },
      {
        id: 2,
        type: 'doctor',
        time: '10:15 AM',
        title: 'Dr. Vandana Saxena (Dermatologist)',
        subtitle: 'Skin & Laser Center, Gomti Nagar',
        lat: 26.8510,
        lng: 80.9920,
        status: 'completed',
        distanceFromPrev: '6.5 km',
        pob: 9500,
        samples: 8,
        accuracy: 'Geo-Verified 8m'
      },
      {
        id: 3,
        type: 'chemist',
        time: '11:45 AM',
        title: 'City Medicos (Chemist Retailer)',
        subtitle: 'Patrakarpuram Market, Gomti Nagar',
        lat: 26.8530,
        lng: 80.9960,
        status: 'completed',
        distanceFromPrev: '2.1 km',
        pob: 9400,
        accuracy: 'Geo-Verified 10m'
      },
      {
        id: 4,
        type: 'current',
        time: 'Live Now',
        title: 'Current Live GPS Position',
        subtitle: 'Patrakarpuram Crossing, Gomti Nagar',
        lat: 26.8520,
        lng: 80.9980,
        status: 'in_progress',
        distanceFromPrev: '1.4 km',
        accuracy: 'Active GPS Ping (5G)'
      }
    ]
  }
];

export default function Tracking() {
  const [activeTab, setActiveTab] = useState<'map' | 'joint_working'>('map');
  const [mapMode, setMapMode] = useState<'all_mrs' | 'single_mr'>('all_mrs');
  const [selectedMrId, setSelectedMrId] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitDetail, setSelectedVisitDetail] = useState<any | null>(null);
  const [filterManager, setFilterManager] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHqFilter, setSelectedHqFilter] = useState('all');

  const loadVisits = async () => {
    setLoading(true);
    try {
      const all = await getAllTeamDCRVisits(selectedDate);
      setVisits(all);
    } catch (e) {
      console.error("Error loading team visits:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVisits();

    const handleDcrUpdated = () => {
      loadVisits();
    };

    window.addEventListener('raxon-dcr-updated', handleDcrUpdated);
    return () => {
      window.removeEventListener('raxon-dcr-updated', handleDcrUpdated);
    };
  }, [selectedDate]);

  const activeCompanyId = getActiveCompanyId();
  const loggedInUser = getLoggedInUser();
  const companyProfiles = getUsersByCompany(activeCompanyId);

  // Filter profiles to team members relevant to this company & manager
  const teamUsers = useMemo(() => {
    let filtered = companyProfiles.filter(u => u.status !== 'Inactive' && u.role !== 'SUPER_ADMIN');
    
    // If logged in as Manager (RM/AM/ZM), prioritize those reporting to manager, or if none tagged, show all field staff in company
    if (loggedInUser && ['RM', 'AM', 'ZM'].includes(loggedInUser.role)) {
      const subs = filtered.filter(u => u.reportingToId === loggedInUser.id || u.reportingToName?.toLowerCase() === loggedInUser.name.toLowerCase());
      if (subs.length > 0) {
        filtered = subs;
      }
    }
    
    if (filtered.length === 0) {
      filtered = companyProfiles.filter(u => u.role !== 'SUPER_ADMIN');
    }
    return filtered;
  }, [companyProfiles, loggedInUser]);

  // Construct dynamic MRTrackProfile array from real company users
  const teamMembersTracking: MRTrackProfile[] = useMemo(() => {
    if (!teamUsers || teamUsers.length === 0) {
      return TEAM_MEMBERS_TRACKING;
    }

    const cityCoordsMap: Record<string, { lat: number; lng: number }> = {
      'lucknow': { lat: 26.8467, lng: 80.9462 },
      'akbarpur': { lat: 26.4300, lng: 82.5400 },
      'varanasi': { lat: 25.2810, lng: 82.9980 },
      'kanpur': { lat: 26.4780, lng: 80.3210 },
      'faizabad': { lat: 26.7725, lng: 82.1460 },
      'ayodhya': { lat: 26.7725, lng: 82.1460 },
      'gorakhpur': { lat: 26.7606, lng: 83.3732 },
      'allahabad': { lat: 25.4358, lng: 81.8463 },
      'prayagraj': { lat: 25.4358, lng: 81.8463 },
      'bareilly': { lat: 28.3670, lng: 79.4304 },
      'agra': { lat: 27.1767, lng: 78.0081 },
      'meerut': { lat: 28.9845, lng: 77.7064 },
      'delhi': { lat: 28.6139, lng: 77.2090 },
      'mumbai': { lat: 19.0760, lng: 72.8777 }
    };

    return teamUsers.map((u, index) => {
      const lowerHq = (u.hq || '').toLowerCase();
      let baseCoord = { lat: 26.8467, lng: 80.9462 };
      for (const cityKey of Object.keys(cityCoordsMap)) {
        if (lowerHq.includes(cityKey)) {
          baseCoord = cityCoordsMap[cityKey];
          break;
        }
      }

      const offsetLat = baseCoord.lat + ((index % 3) * 0.012 - 0.006);
      const offsetLng = baseCoord.lng + (Math.floor(index / 3) * 0.015 - 0.0075);

      const userVisits = visits.filter(v => v.repId === u.id || (v.repName && v.repName.toLowerCase() === u.name.toLowerCase()));

      let waypoints = [];
      if (userVisits.length > 0) {
        waypoints = userVisits.map((v, wIdx) => ({
          id: wIdx + 1,
          type: (v.type || 'doctor') as any,
          time: v.time || `${9 + wIdx}:30 AM`,
          title: v.doctorName ? `Dr. ${v.doctorName}` : (v.chemistName || `Field Stop #${wIdx + 1}`),
          subtitle: v.address || v.area || `${u.hq || 'HQ'} Market Area`,
          lat: offsetLat + (wIdx * 0.002),
          lng: offsetLng + (wIdx * 0.003),
          status: 'completed' as const,
          distanceFromPrev: `${(1.5 + wIdx * 0.8).toFixed(1)} km`,
          pob: v.pobTotalValue || 0,
          samples: (v.samplesGiven || []).reduce((acc: number, s: any) => acc + (s.quantity || 0), 0),
          feedback: v.notes || 'Call reported via DCR',
          isJointWithManager: v.isJointWorking,
          managerName: v.jointManagerName,
          accuracy: 'Geo-Verified 10m'
        }));

        waypoints.push({
          id: waypoints.length + 1,
          type: 'current' as const,
          time: 'Live Now',
          title: 'Current Live GPS Position',
          subtitle: `Active on field in ${u.territory || u.hq || 'HQ Patch'}`,
          lat: offsetLat + (waypoints.length * 0.002),
          lng: offsetLng + (waypoints.length * 0.003),
          status: 'in_progress' as const,
          distanceFromPrev: '1.2 km',
          accuracy: 'Active 4G GPS Ping'
        });
      } else {
        waypoints = [
          {
            id: 1,
            type: 'start' as const,
            time: u.metrics?.punchInTime || '09:00 AM',
            title: 'Morning Duty Punch-In',
            subtitle: `${u.hq || 'HQ'} Field Residence / Hub`,
            lat: offsetLat - 0.004,
            lng: offsetLng - 0.004,
            status: 'completed' as const,
            distanceFromPrev: '0.0 km',
            accuracy: 'GPS Lock 8m'
          },
          {
            id: 2,
            type: 'current' as const,
            time: 'Live Now',
            title: 'Current Live GPS Position',
            subtitle: `Active in ${u.territory || u.hq || 'Assigned Territory'}`,
            lat: offsetLat,
            lng: offsetLng,
            status: 'in_progress' as const,
            distanceFromPrev: '3.5 km',
            accuracy: 'Active GPS Ping'
          }
        ];
      }

      return {
        id: index + 1,
        empId: u.id,
        name: u.name,
        role: u.roleTitle || u.role,
        hq: u.hq || 'Head Office',
        phone: u.phone || '+91 98000 00000',
        status: (u.status === 'Inactive' ? 'Inactive' : 'Active') as 'Active' | 'On Break' | 'Inactive',
        battery: 82 + ((index * 7) % 18),
        speed: u.metrics?.isPunchedIn ? '16 km/h (In Transit)' : '0 km/h (Field Stop)',
        totalDistanceKm: Number((12.4 + index * 3.2).toFixed(1)),
        punchInTime: u.metrics?.punchInTime || '09:00 AM',
        lastPingTime: 'Just now',
        plannedPatch: u.metrics?.currentPatchName || u.territory || `${u.hq || 'HQ'} Central Market`,
        currentLocationName: u.metrics?.gpsLocation ? `GPS: ${u.metrics.gpsLocation}` : `Near Central Market, ${u.hq || 'HQ'}`,
        coords: {
          lat: Number(offsetLat.toFixed(4)),
          lng: Number(offsetLng.toFixed(4)),
          str: `${offsetLat.toFixed(4)}° N, ${offsetLng.toFixed(4)}° E`
        },
        pobToday: u.metrics?.pobBookedToday || (userVisits.reduce((acc, v) => acc + (v.pobTotalValue || 0), 0) || (u.role === 'MR' ? 8500 : 15000)),
        callsDone: userVisits.length || u.metrics?.completedCallsToday || (u.role === 'MR' ? 4 : 6),
        totalPlannedCalls: u.metrics?.plannedCallsToday || 8,
        waypoints: waypoints
      };
    });
  }, [teamUsers, visits]);

  // Selected individual MR profile
  const selectedMr = teamMembersTracking.find(m => m.id === selectedMrId) || teamMembersTracking[0];

  // Filtered team members for All MRs view
  const filteredTeamMembers = teamMembersTracking.filter(m => {
    const matchesHq = selectedHqFilter === 'all' || m.hq.toLowerCase().includes(selectedHqFilter.toLowerCase());
    const matchesSearch = !searchQuery || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.plannedPatch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.hq.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.empId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHq && matchesSearch;
  });

  // Joint working filter
  const jointVisits = visits.filter(v => v.isJointWorking || v.jointManagerName);

  const filteredJointVisits = jointVisits.filter(v => {
    const matchesManager = filterManager === 'all' || (v.jointManagerName && v.jointManagerName.toLowerCase().includes(filterManager.toLowerCase()));
    const matchesSearch = !searchQuery || 
      (v.doctorName && v.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.repName && v.repName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.area && v.area.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesManager && matchesSearch;
  });

  const totalJointVisitsCount = jointVisits.length;
  const totalPobValueAcrossJoint = jointVisits.reduce((acc, v) => acc + (v.pobTotalValue || 0), 0);
  const totalSamplesGivenJoint = jointVisits.reduce((acc, v) => {
    const samples = v.samplesGiven || [];
    return acc + samples.reduce((sAcc: number, s: any) => sAcc + (s.quantity || 0), 0);
  }, 0);

  // Quick next/prev MR handlers
  const handleNextMr = () => {
    const currentIndex = teamMembersTracking.findIndex(m => m.id === selectedMrId);
    const nextIndex = (currentIndex + 1) % teamMembersTracking.length;
    setSelectedMrId(teamMembersTracking[nextIndex].id);
  };

  const handlePrevMr = () => {
    const currentIndex = teamMembersTracking.findIndex(m => m.id === selectedMrId);
    const prevIndex = (currentIndex - 1 + teamMembersTracking.length) % teamMembersTracking.length;
    setSelectedMrId(teamMembersTracking[prevIndex].id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Field Work & Team Tracking</h1>
          <p className="text-gray-500 text-sm">
            Live GPS route breadcrumbs, One-by-One MR tracking, joint doctor calls, and brandwise POB orders
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 border border-gray-300 rounded-lg shadow-2xs">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-gray-600">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-bold text-gray-900 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Top Tabs */}
      <div className="flex border-b border-gray-200 space-x-2">
        <button
          onClick={() => setActiveTab('map')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'map'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Navigation className="w-4 h-4" />
          Live GPS Route Map
        </button>

        <button
          onClick={() => setActiveTab('joint_working')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'joint_working'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Manager Joint Working Status
          <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full font-extrabold">
            {jointVisits.length}
          </span>
        </button>
      </div>

      {/* TAB 1: LIVE GPS ROUTE MAP (ALL MRS + ONE-BY-ONE MR TRACKING) */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          {/* Tracking Mode Switcher Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
              <button
                onClick={() => setMapMode('all_mrs')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  mapMode === 'all_mrs'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>All MRs Live Map ({teamMembersTracking.length})</span>
              </button>

              <button
                onClick={() => setMapMode('single_mr')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  mapMode === 'single_mr'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Route className="w-3.5 h-3.5" />
                <span>One-by-One MR Route Track</span>
              </button>
            </div>

            {/* In Single MR mode: Show MR Selector Dropdown / Switcher */}
            {mapMode === 'single_mr' ? (
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <button
                  onClick={handlePrevMr}
                  className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer"
                  title="Previous MR"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-gray-600">Active MR:</span>
                  <select
                    value={selectedMrId}
                    onChange={(e) => setSelectedMrId(Number(e.target.value))}
                    className="text-xs font-black text-indigo-950 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
                  >
                    {teamMembersTracking.map(mr => (
                      <option key={mr.empId || mr.id} value={mr.id}>
                        {mr.name} ({mr.hq}) - {mr.role}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleNextMr}
                  className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer"
                  title="Next MR"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* In All MRs mode: Quick Filter by HQ */
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-600">HQ Filter:</span>
                <select
                  value={selectedHqFilter}
                  onChange={(e) => setSelectedHqFilter(e.target.value)}
                  className="text-xs font-bold text-gray-900 border border-gray-300 rounded-lg px-2.5 py-1 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Headquarters</option>
                  <option value="Akbarpur">Akbarpur HQ</option>
                  <option value="Faizabad">Faizabad HQ</option>
                  <option value="Varanasi">Varanasi HQ</option>
                  <option value="Kanpur">Kanpur HQ</option>
                  <option value="Lucknow">Lucknow HQ</option>
                </select>
              </div>
            )}
          </div>

          {/* VIEW 1: ONE-BY-ONE MR ROUTE TRACKING */}
          {mapMode === 'single_mr' && (
            <div className="space-y-4">
              {/* Selected MR Profile Header Banner */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start sm:items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                      {selectedMr.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h2 className="text-lg font-extrabold text-gray-900">{selectedMr.name}</h2>
                        <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                          {selectedMr.hq}
                        </span>
                        <span className={`text-2xs font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          selectedMr.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${selectedMr.status === 'Active' ? 'bg-emerald-600 animate-ping' : 'bg-amber-600'}`}></span>
                          {selectedMr.status}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span>Planned Patch: <strong className="text-indigo-700">{selectedMr.plannedPatch}</strong></span>
                        <span>•</span>
                        <span>Punch-in: <strong>{selectedMr.punchInTime}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <Battery className="w-3.5 h-3.5" /> {selectedMr.battery}%
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" /> Ping: {selectedMr.lastPingTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons for Joint Manager */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href={`tel:${selectedMr.phone}`}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      title="Direct Phone Call to MR"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call MR</span>
                    </a>

                    <a
                      href={`https://wa.me/${selectedMr.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      title="Send WhatsApp Field Instructions"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        const call = selectedMr.waypoints.find(w => w.type === 'doctor');
                        if (call) {
                          setSelectedVisitDetail({
                            doctorName: call.title,
                            callType: call.isJointWithManager ? 'Manager Joint Working' : 'Single Doctor Call',
                            repName: selectedMr.name,
                            area: selectedMr.plannedPatch,
                            jointManagerName: call.managerName || 'Area Manager',
                            timestamp: new Date().toISOString(),
                            doctorFeedback: call.feedback,
                            remarks: 'Detailed live route waypoint inspection',
                            samplesGiven: call.samples ? [{ sampleName: 'Raxon-CV 625 Catch Cover', quantity: call.samples }] : [],
                            giftsGiven: [],
                            pobOrders: call.pob ? [{ productName: 'Raxon-CV 625 Strip', quantity: 20, ptr: 152, totalAmount: call.pob }] : [],
                            pobTotalValue: call.pob || 0
                          });
                        }
                      }}
                      className="px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Report</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-100 text-center">
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-3xs font-bold text-gray-500 uppercase">Distance Covered</span>
                    <div className="text-base font-black text-gray-900 mt-0.5">{selectedMr.totalDistanceKm} km</div>
                    <span className="text-3xs text-gray-400">Speed: {selectedMr.speed}</span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-3xs font-bold text-gray-500 uppercase">Doctor Calls Completed</span>
                    <div className="text-base font-black text-indigo-900 mt-0.5">
                      {selectedMr.callsDone} / {selectedMr.totalPlannedCalls}
                    </div>
                    <span className="text-3xs text-emerald-600 font-bold">
                      {Math.round((selectedMr.callsDone / selectedMr.totalPlannedCalls) * 100)}% Target
                    </span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-3xs font-bold text-gray-500 uppercase">Chemist POB Value</span>
                    <div className="text-base font-black text-emerald-700 mt-0.5">
                      ₹{selectedMr.pobToday.toLocaleString('en-IN')}
                    </div>
                    <span className="text-3xs text-emerald-600 font-semibold">Booked Today</span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="text-3xs font-bold text-gray-500 uppercase">Live GPS Coordinates</span>
                    <div className="text-2xs font-mono font-bold text-gray-800 mt-0.5">{selectedMr.coords.str}</div>
                    <span className="text-3xs text-indigo-600 font-semibold">Accuracy: ±8m</span>
                  </div>
                </div>
              </div>

              {/* Main Grid: Visual Map Canvas + Sequential Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Visual Map Canvas (Left 7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col min-h-[460px]">
                  <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-extrabold text-gray-900 text-xs">
                        Real-Time Field Route: {selectedMr.name} ({selectedMr.plannedPatch})
                      </h3>
                    </div>
                    <span className="text-3xs px-2 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold rounded-full border border-emerald-300">
                      Live Telemetry Stream
                    </span>
                  </div>

                  {/* Interactive Map Visualizer */}
                  <div className="flex-1 bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-100 p-6 flex flex-col justify-between relative overflow-hidden">
                    {/* SVG Map Grid Background */}
                    <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, indigo 1.5px, transparent 0)', backgroundSize: '28px 28px' }}></div>

                    {/* Dynamic Connected SVG Path */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M 60 70 Q 150 120 220 180 T 360 220 T 480 320"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        className="animate-pulse"
                      />
                    </svg>

                    {/* Top Overlay Card */}
                    <div className="relative z-10 bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-indigo-100 shadow-xs max-w-sm">
                      <div className="text-3xs font-extrabold text-indigo-700 uppercase tracking-wider">Active Patch Tracking</div>
                      <div className="text-xs font-bold text-gray-900 mt-0.5">{selectedMr.currentLocationName}</div>
                      <div className="text-3xs text-gray-500 mt-1">
                        Last ping recorded at {selectedMr.lastPingTime} • Device Speed: {selectedMr.speed}
                      </div>
                    </div>

                    {/* Map Waypoint Markers Simulation */}
                    <div className="relative z-10 my-8 space-y-6">
                      <div className="flex flex-wrap items-center justify-around gap-4">
                        {selectedMr.waypoints.map((wp, idx) => (
                          <div 
                            key={wp.id} 
                            className={`p-2.5 rounded-xl border shadow-xs transition-all max-w-[170px] ${
                              wp.type === 'current'
                                ? 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-200 animate-bounce'
                                : wp.type === 'start'
                                ? 'bg-gray-900 text-white border-gray-800'
                                : wp.isJointWithManager
                                ? 'bg-amber-50 border-amber-300 text-amber-950'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <div className="flex items-center justify-between text-3xs font-extrabold mb-1">
                              <span className={wp.type === 'current' ? 'text-indigo-200' : 'text-gray-500'}>
                                #{idx + 1} • {wp.time}
                              </span>
                              {wp.pob && (
                                <span className="px-1 py-0.2 bg-emerald-500 text-white rounded font-black">
                                  ₹{wp.pob}
                                </span>
                              )}
                            </div>
                            <div className="text-2xs font-bold truncate">{wp.title}</div>
                            <div className={`text-3xs truncate ${wp.type === 'current' ? 'text-indigo-100' : 'text-gray-500'}`}>
                              {wp.subtitle}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status Pill */}
                    <div className="relative z-10 flex items-center justify-between bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-gray-200 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                        <span className="font-extrabold text-gray-900">GPS Signal Strong (4G LTE)</span>
                      </div>
                      <span className="text-3xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        Geo-Fence Verified: Within 50m of Target Doctor
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sequential Call Sequence Timeline (Right 5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col">
                  <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-extrabold text-gray-900 text-xs">
                        Call Sequence Timeline ({selectedMr.waypoints.length} Stops)
                      </h3>
                    </div>
                    <span className="text-3xs text-gray-500 font-semibold">{selectedDate}</span>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[480px] space-y-4">
                    {selectedMr.waypoints.map((wp, idx) => (
                      <div key={wp.id} className="relative pl-6 border-l-2 border-indigo-200 last:border-transparent pb-4">
                        {/* Dot indicator */}
                        <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-3xs font-black shadow-2xs ${
                          wp.type === 'current'
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                            : wp.type === 'start'
                            ? 'bg-gray-900 text-white'
                            : wp.isJointWithManager
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Card */}
                        <div className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                          wp.type === 'current'
                            ? 'bg-indigo-50 border-indigo-300 shadow-2xs'
                            : 'bg-white border-gray-200 hover:border-indigo-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-gray-900">{wp.title}</span>
                            <span className="text-3xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {wp.time}
                            </span>
                          </div>

                          <div className="text-gray-600 text-3xs flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{wp.subtitle}</span>
                          </div>

                          {wp.isJointWithManager && (
                            <div className="p-1.5 bg-amber-100 text-amber-950 rounded text-3xs font-extrabold flex items-center gap-1 border border-amber-300">
                              <Users className="w-3 h-3 text-amber-700" />
                              <span>Accompanied by: {wp.managerName}</span>
                            </div>
                          )}

                          {wp.feedback && (
                            <div className="text-3xs text-gray-600 italic bg-gray-50 p-1.5 rounded border border-gray-100">
                              "{wp.feedback}"
                            </div>
                          )}

                          <div className="flex items-center justify-between text-3xs font-bold pt-1 border-t border-gray-100 text-gray-500">
                            <span>Leg Distance: {wp.distanceFromPrev}</span>
                            {wp.pob && (
                              <span className="text-emerald-700 font-extrabold">POB: ₹{wp.pob}</span>
                            )}
                            {wp.samples && (
                              <span className="text-amber-700 font-extrabold">{wp.samples} Samples</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: ALL MRS LIVE TERRITORY MAP */}
          {mapMode === 'all_mrs' && (
            <div className="space-y-4">
              {/* Territory Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeamMembers.map(mr => (
                  <div 
                    key={mr.id} 
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-2xs">
                          {mr.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-extrabold text-gray-900 text-sm">{mr.name}</div>
                          <div className="text-3xs text-gray-500">{mr.hq}</div>
                        </div>
                      </div>

                      <span className={`text-3xs font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        mr.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${mr.status === 'Active' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`}></span>
                        {mr.status}
                      </span>
                    </div>

                    {/* Patch & Location */}
                    <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-indigo-950 font-bold">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Patch: {mr.plannedPatch}</span>
                        </span>
                        <span className="text-3xs text-indigo-700 font-extrabold">{mr.lastPingTime}</span>
                      </div>
                      <div className="text-3xs text-gray-600 truncate">{mr.currentLocationName}</div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center text-3xs border-t border-gray-100 pt-2 font-bold text-gray-600">
                      <div>
                        <span className="text-gray-400 block font-normal">Distance</span>
                        <span className="text-gray-900 font-extrabold">{mr.totalDistanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-normal">Calls Done</span>
                        <span className="text-indigo-700 font-extrabold">{mr.callsDone}/{mr.totalPlannedCalls}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-normal">POB Booked</span>
                        <span className="text-emerald-700 font-extrabold">₹{mr.pobToday}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedMrId(mr.id);
                          setMapMode('single_mr');
                        }}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Route className="w-3.5 h-3.5" />
                        <span>Track Route (One-by-One)</span>
                      </button>

                      <a
                        href={`tel:${mr.phone}`}
                        className="p-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg"
                        title="Call MR"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: JOINT WORKING STATUS */}
      {activeTab === 'joint_working' && (
        <div className="space-y-6">
          {/* Overview Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Joint Doctor Calls</span>
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-2">{totalJointVisitsCount}</div>
              <p className="text-3xs text-gray-500 mt-1">Accompanied calls with AM / RM / ZM</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Joint Order Value (POB)</span>
                <IndianRupee className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-2">₹{totalPobValueAcrossJoint.toFixed(2)}</div>
              <p className="text-3xs text-gray-500 mt-1">Booked during joint fieldwork</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Samples Delivered</span>
                <Pill className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-amber-700 mt-2">{totalSamplesGivenJoint} Units</div>
              <p className="text-3xs text-gray-500 mt-1">Physician clinical trial packs</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Doctor, MR, or Patch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">Filter Manager:</span>
              <select
                value={filterManager}
                onChange={(e) => setFilterManager(e.target.value)}
                className="p-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Managers</option>
                <option value="Rahul Sharma">Rahul Sharma (AM)</option>
                <option value="R.K. Tiwari">R.K. Tiwari (RM)</option>
                <option value="V.P. Singhania">V.P. Singhania (ZM)</option>
              </select>
            </div>
          </div>

          {/* Joint Calls Table */}
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading joint working records...</div>
          ) : filteredJointVisits.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center border border-dashed border-gray-300 shadow-2xs">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No Joint Working Calls Found</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                When an MR logs a doctor visit in DCR and checks <strong>"Manager Joint Working"</strong>, the detailed call records (Doctor, Manager Name, Samples, Gifts, POB, Remarks) will automatically appear in this view.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Doctor-Wise Joint Working Visit Log ({filteredJointVisits.length})
                </h3>
                <span className="text-3xs text-gray-500">Live updated from field DCR</span>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredJointVisits.map((visit, index) => {
                  return (
                    <div key={index} className="p-4 hover:bg-indigo-50/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Doctor & Manager */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900 text-base">{visit.doctorName || `Doctor #${visit.doctorId}`}</span>
                          <span className="text-3xs px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded-full">
                            {visit.callType || 'Joint Call'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span className="font-medium flex items-center text-indigo-900">
                            <Users className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                            Accompanying Manager: <strong>{visit.jointManagerName || 'Area Manager'}</strong>
                          </span>
                          <span>•</span>
                          <span>MR: <strong className="text-gray-800">{visit.repName}</strong></span>
                          <span>•</span>
                          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {visit.area}</span>
                          <span>•</span>
                          <span className="flex items-center text-gray-400"><Clock className="w-3.5 h-3.5 mr-1" /> {visit.timestamp ? format(new Date(visit.timestamp), 'hh:mm a') : 'Today'}</span>
                        </div>
                      </div>

                      {/* Right: Quick Audit View */}
                      <button
                        onClick={() => setSelectedVisitDetail(visit)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors self-start md:self-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Call Details</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Full Visit Inspection */}
      {selectedVisitDetail && (
        <Modal
          isOpen={!!selectedVisitDetail}
          onClose={() => setSelectedVisitDetail(null)}
          title={`Call Audit Report: ${selectedVisitDetail.doctorName || 'Doctor Visit'}`}
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Header card */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-indigo-900 text-sm">
                <span>{selectedVisitDetail.doctorName}</span>
                <span className="px-2 py-0.5 bg-indigo-200 text-indigo-900 rounded font-semibold text-3xs">
                  {selectedVisitDetail.callType || 'Joint Call'}
                </span>
              </div>
              <div className="text-gray-700">MR: <strong>{selectedVisitDetail.repName}</strong> • Patch: {selectedVisitDetail.area}</div>
              <div className="text-indigo-800 font-semibold flex items-center">
                <Users className="w-3.5 h-3.5 mr-1" /> Accompanied Manager: {selectedVisitDetail.jointManagerName}
              </div>
              <div className="text-gray-500 text-3xs">Logged at: {selectedVisitDetail.timestamp ? format(new Date(selectedVisitDetail.timestamp), 'dd MMM yyyy, hh:mm a') : 'Today'}</div>
            </div>

            {/* Doctor Feedback & Remarks */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-gray-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                Doctor Feedback & Remarks
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-200 space-y-1">
                <div className="font-semibold text-gray-900">Response: <span className="text-indigo-700">{selectedVisitDetail.doctorFeedback || 'Positive'}</span></div>
                <div className="text-gray-700">Remarks: "{selectedVisitDetail.remarks || 'No specific remarks entered'}"</div>
              </div>
            </div>

            {/* Samples Given */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-gray-800 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-amber-600" />
                Sample Distribution ({selectedVisitDetail.samplesGiven?.length || 0})
              </div>
              {(!selectedVisitDetail.samplesGiven || selectedVisitDetail.samplesGiven.length === 0) ? (
                <div className="text-gray-400 italic">No samples given in this call.</div>
              ) : (
                <div className="grid grid-cols-1 gap-1.5">
                  {selectedVisitDetail.samplesGiven.map((s: any, i: number) => (
                    <div key={i} className="bg-white p-2 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="font-semibold text-gray-800">{s.sampleName}</span>
                      <span className="font-bold text-indigo-700">{s.quantity} Units</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* POB Order Booked */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-gray-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                  Brandwise Order Booked (POB)
                </span>
                <span className="text-emerald-700 font-extrabold">Total: ₹{(selectedVisitDetail.pobTotalValue || 0).toFixed(2)}</span>
              </div>

              {(!selectedVisitDetail.pobOrders || selectedVisitDetail.pobOrders.length === 0) ? (
                <div className="text-gray-400 italic">No commercial order booked.</div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <table className="min-w-full divide-y divide-gray-200 text-3xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1.5 text-left font-bold text-gray-600">Product</th>
                        <th className="px-2 py-1.5 text-center font-bold text-gray-600">Qty</th>
                        <th className="px-2 py-1.5 text-right font-bold text-gray-600">PTR</th>
                        <th className="px-2 py-1.5 text-right font-bold text-gray-600">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedVisitDetail.pobOrders.map((p: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-2 py-1.5 font-bold text-gray-800">{p.productName}</td>
                          <td className="px-2 py-1.5 text-center">{p.quantity}</td>
                          <td className="px-2 py-1.5 text-right">₹{p.ptr?.toFixed(2)}</td>
                          <td className="px-2 py-1.5 text-right font-bold text-emerald-700">₹{p.totalAmount?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedVisitDetail(null)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
