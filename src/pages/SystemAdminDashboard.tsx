import React, { useState } from 'react';
import { Users, FileText, CheckCircle, Clock, Map, PieChart, Activity, Building, ArrowRight, UserPlus, FileSpreadsheet, Send, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function SystemAdminDashboard() {
  const kpis = [
    { title: 'Total Employees', value: '142', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Pending Approvals', value: '18', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Today\'s Attendance', value: '94%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Master Sync Errors', value: '0', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const complianceData = [
    { name: 'Mon', attendance: 95, dcr: 90 },
    { name: 'Tue', attendance: 96, dcr: 92 },
    { name: 'Wed', attendance: 94, dcr: 94 },
    { name: 'Thu', attendance: 98, dcr: 95 },
    { name: 'Fri', attendance: 92, dcr: 88 },
    { name: 'Sat', attendance: 85, dcr: 80 },
    { name: 'Sun', attendance: 0, dcr: 0 },
  ];

  const recentActivities = [
    { id: 1, user: 'MR Pradeep Mishra', action: 'submitted DCR for Iltifatganj', time: '10 mins ago', type: 'dcr' },
    { id: 2, user: 'AM Rahul Sharma', action: 'approved MTP for 3 users', time: '1 hour ago', type: 'approval' },
    { id: 3, user: 'MR Amit Singh', action: 'marked attendance with GPS deviation', time: '2 hours ago', type: 'alert' },
    { id: 4, user: 'System', action: 'completed automated database backup', time: '3 hours ago', type: 'system' },
    { id: 5, user: 'MR Vivek Kumar', action: 'added a new Doctor in Akbarpur 1', time: '4 hours ago', type: 'master' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage Raxon Healthcare hierarchy, users, and pharmaceutical master data.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center shadow-xs">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Data
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-xs">
            <UserPlus className="w-4 h-4 mr-2" /> Add Employee
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center">
            <div className={`w-12 h-12 rounded-lg ${kpi.bg} flex items-center justify-center mr-4 flex-shrink-0`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts & Hierarchy */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Weekly Compliance Trends</h2>
                <p className="text-xs text-gray-500 mt-1">Attendance vs DCR Submission Rates (%)</p>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDcr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" />
                  <Area type="monotone" dataKey="dcr" name="DCR %" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorDcr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-lg font-bold text-gray-900">Organization Hierarchy</h2>
              <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center">
                Manage Hierarchy <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer">
                <div className="text-sm text-gray-500 mb-1 font-medium">Divisions</div>
                <div className="text-2xl font-bold text-gray-900">3</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer">
                <div className="text-sm text-gray-500 mb-1 font-medium">Regions</div>
                <div className="text-2xl font-bold text-gray-900">12</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer">
                <div className="text-sm text-gray-500 mb-1 font-medium">HQ / Areas</div>
                <div className="text-2xl font-bold text-gray-900">48</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer">
                <div className="text-sm text-gray-500 mb-1 font-medium">Patches</div>
                <div className="text-2xl font-bold text-gray-900">215</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Master Data Health</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-100 rounded-lg shadow-2xs hover:border-indigo-200 transition-colors cursor-pointer">
                <div className="font-semibold text-gray-900">Products & Brands</div>
                <div className="text-sm text-gray-500 mt-1">245 active SKUs</div>
                <div className="text-xs text-green-600 mt-3 font-medium flex items-center bg-green-50 w-fit px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3 mr-1" /> Synced 1h ago
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-lg shadow-2xs hover:border-indigo-200 transition-colors cursor-pointer">
                <div className="font-semibold text-gray-900">Doctor Directory</div>
                <div className="text-sm text-gray-500 mt-1">14,204 registered</div>
                <div className="text-xs text-green-600 mt-3 font-medium flex items-center bg-green-50 w-fit px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3 mr-1" /> Auto-approval ON
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-lg shadow-2xs hover:border-indigo-200 transition-colors cursor-pointer">
                <div className="font-semibold text-gray-900">Chemist Network</div>
                <div className="text-sm text-gray-500 mt-1">8,450 registered</div>
                <div className="text-xs text-amber-600 mt-3 font-medium flex items-center bg-amber-50 w-fit px-2 py-1 rounded">
                  <Clock className="w-3 h-3 mr-1" /> 12 pending checks
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Roles, Quick Actions, Feed */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 text-gray-500 mr-2" />
              Role Distribution
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Medical Representatives</span>
                <span className="font-bold text-gray-900">110</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: '77%'}}></div></div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600 font-medium">Area Managers (AM)</span>
                <span className="font-bold text-gray-900">24</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{width: '16%'}}></div></div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600 font-medium">Regional Managers (RM)</span>
                <span className="font-bold text-gray-900">8</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{width: '7%'}}></div></div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-xl shadow-xs border border-indigo-700 p-5 text-white">
            <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
            <div className="space-y-2 mt-4">
              <button className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-sm font-medium transition-colors flex items-center justify-between px-4">
                <span>Broadcast Message</span>
                <Send className="w-4 h-4" />
              </button>
              <button className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-sm font-medium transition-colors flex items-center justify-between px-4">
                <span>Run Monthly Reports</span>
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 text-gray-500 mr-2" />
                Live Feed
              </h2>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 flex-shrink-0 ${
                    activity.type === 'dcr' ? 'bg-emerald-500' :
                    activity.type === 'approval' ? 'bg-blue-500' :
                    activity.type === 'alert' ? 'bg-amber-500' :
                    activity.type === 'master' ? 'bg-purple-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold text-gray-900">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 transition-colors">
              View Complete Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
