import React, { useState } from 'react';
import { Clock, MapPin, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const [records] = useState([
    { id: 'ATT-101', name: 'Dr. Rahul Sharma', role: 'Medical Representative', checkIn: '08:45 AM', checkOut: '05:30 PM', location: 'Apollo Hospital, Delhi', status: 'PRESENT' },
    { id: 'ATT-102', name: 'Priya Patel', role: 'Area Sales Manager', checkIn: '09:12 AM', checkOut: '06:00 PM', location: 'Central Hub, Mumbai', status: 'PRESENT' },
    { id: 'ATT-103', name: 'Amit Kumar', role: 'Medical Representative', checkIn: '09:40 AM', checkOut: '--', location: 'Lifeline Clinic, Bangalore', status: 'LATE' },
    { id: 'ATT-104', name: 'Sanjay Singh', role: 'Territory Manager', checkIn: '--', checkOut: '--', location: 'Approved Sick Leave', status: 'LEAVE' },
    { id: 'ATT-105', name: 'Neha Verma', role: 'Medical Representative', checkIn: '08:50 AM', checkOut: '05:15 PM', location: 'Max Super Specialty, Noida', status: 'PRESENT' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Field Staff Attendance & Geofencing</h2>
          <p className="text-xs text-slate-500">GPS verified daily check-ins and working hours tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
            + Manual Attendance Entry
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search rep name or location..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
            <Filter className="w-3.5 h-3.5" /> Filter Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Employee</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Check In</th>
                <th className="p-3.5">Check Out</th>
                <th className="p-3.5">GPS Location</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">{row.name}</td>
                  <td className="p-3.5 text-slate-500">{row.role}</td>
                  <td className="p-3.5 font-medium text-slate-800">{row.checkIn}</td>
                  <td className="p-3.5 text-slate-500">{row.checkOut}</td>
                  <td className="p-3.5">
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {row.location}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                      row.status === 'LATE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
