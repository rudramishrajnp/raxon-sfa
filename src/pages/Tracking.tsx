import React from 'react';
import { MapPin, Navigation, User, Clock, Map as MapIcon } from 'lucide-react';

export default function Tracking() {
  const TEAM_LOCATIONS = [
    { id: 1, name: 'Pradeep Mishra', role: 'MR', status: 'Active', lastLocation: 'Jalalpur Market', coords: '26.3122° N, 82.7390° E', lastTime: '2 mins ago' },
    { id: 2, name: 'Rahul Singh', role: 'MR', status: 'Inactive', lastLocation: 'Akbarpur 1', coords: '26.4300° N, 82.5400° E', lastTime: '2 hours ago' },
    { id: 3, name: 'Amit Verma', role: 'MR', status: 'Active', lastLocation: 'Shahzadpur', coords: '26.4112° N, 82.5110° E', lastTime: '15 mins ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Team Tracking</h1>
          <p className="text-gray-500">Monitor real-time GPS locations of your field force</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col relative overflow-hidden">
          <div className="flex-1 bg-indigo-50/50 flex flex-col items-center justify-center p-8 text-center relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, indigo 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <MapIcon size={64} className="text-indigo-300 mb-4 relative z-10" />
            <h3 className="text-xl font-bold text-indigo-900 relative z-10 mb-2">Live Map View</h3>
            <p className="text-gray-600 max-w-md relative z-10">
              The Google Maps or Leaflet map integration will appear here, showing pins for all active field force members based on their DCR check-ins.
            </p>
            
            {/* Fake Pins for UI visualization */}
            <div className="absolute top-1/4 left-1/4 z-20 flex flex-col items-center">
              <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-1">Pradeep</div>
              <MapPin size={32} className="text-indigo-600 animate-bounce" />
            </div>
            <div className="absolute bottom-1/3 right-1/3 z-20 flex flex-col items-center">
              <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-1">Amit</div>
              <MapPin size={32} className="text-green-600" />
            </div>
            <div className="absolute top-1/2 right-1/4 z-20 flex flex-col items-center opacity-50">
              <div className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-1">Rahul</div>
              <MapPin size={32} className="text-gray-500" />
            </div>
          </div>
        </div>

        {/* Team List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Active Field Force</h3>
          </div>
          
          <div className="divide-y divide-gray-100 overflow-y-auto flex-1 p-2">
            {TEAM_LOCATIONS.map(member => (
              <div key={member.id} className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mr-3 shadow-sm ${member.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <span className="font-semibold text-gray-900">{member.name}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">{member.role}</span>
                </div>
                
                <div className="space-y-1.5 mt-3 text-sm text-gray-600 ml-5">
                  <p className="flex items-center"><Navigation size={14} className="mr-2 text-indigo-500" /> {member.lastLocation}</p>
                  <p className="flex items-center text-xs text-gray-500"><MapPin size={14} className="mr-2 text-gray-400" /> {member.coords}</p>
                  <p className="flex items-center text-xs text-amber-600 font-medium"><Clock size={14} className="mr-2 text-amber-500" /> {member.lastTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
