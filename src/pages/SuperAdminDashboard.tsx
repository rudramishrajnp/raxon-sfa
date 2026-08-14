import React from 'react';
import { Building2, Users, Shield, Server, Activity, Database, AlertTriangle } from 'lucide-react';

export default function SuperAdminDashboard() {
  const kpis = [
    { title: 'Total Companies', value: '42', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Active System Admins', value: '108', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Server Health', value: '99.9%', icon: Server, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Security Alerts', value: '3', icon: Shield, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SaaS Super Admin Control Center</h1>
          <p className="text-gray-500 text-sm mt-1">Multi-tenant management, global policies, and system monitoring.</p>
        </div>
      </div>

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
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Active Companies (Tenants)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="font-semibold py-2 px-3">Company Name</th>
                    <th className="font-semibold py-2 px-3">Subscription</th>
                    <th className="font-semibold py-2 px-3">Active Users</th>
                    <th className="font-semibold py-2 px-3">Storage</th>
                    <th className="font-semibold py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-3 font-medium">Sun Pharma Enterprises</td>
                    <td className="py-3 px-3 text-indigo-600">Enterprise</td>
                    <td className="py-3 px-3">4,520</td>
                    <td className="py-3 px-3">420 GB</td>
                    <td className="py-3 px-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">Active</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">Raxon Healthcare (Demo)</td>
                    <td className="py-3 px-3 text-blue-600">Pro</td>
                    <td className="py-3 px-3">142</td>
                    <td className="py-3 px-3">12 GB</td>
                    <td className="py-3 px-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">Active</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">MediLife Labs</td>
                    <td className="py-3 px-3 text-amber-600">Trial</td>
                    <td className="py-3 px-3">15</td>
                    <td className="py-3 px-3">2 GB</td>
                    <td className="py-3 px-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">Expiring Soon</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="text-indigo-600 font-medium text-sm hover:text-indigo-800">View All Organizations →</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
              Recent Audit Logs
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-indigo-500 pl-3">
                <p className="text-xs text-gray-500">Just now • IP: 192.168.1.1</p>
                <p className="text-sm font-medium text-gray-800">SuperAdmin assigned Global RBAC permission to System Admin (ID: 4021).</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-3">
                <p className="text-xs text-gray-500">10 mins ago • IP: 103.45.2.1</p>
                <p className="text-sm font-medium text-gray-800">Company 'Apex Pharma' storage limit increased to 500GB.</p>
              </div>
              <div className="border-l-2 border-red-500 pl-3">
                <p className="text-xs text-gray-500">1 hr ago • System</p>
                <p className="text-sm font-medium text-gray-800">Failed database backup for Node-Asia-2. Retrying.</p>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
              View Complete Security Logs
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 text-gray-500 mr-2" />
              Platform Infrastructure
            </h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-600">Database Capacity</span>
                  <span className="text-gray-900">76%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full" style={{width: '76%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-600">API Gateway Load</span>
                  <span className="text-gray-900">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: '42%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-600">Storage Buckets</span>
                  <span className="text-gray-900">89%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{width: '89%'}}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
