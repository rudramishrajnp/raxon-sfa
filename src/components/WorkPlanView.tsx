import React from 'react';
import { Calendar, UserCheck, Stethoscope, Building2, Map } from 'lucide-react';

export const WorkPlanView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Monthly Target Plan (MTP) & Tour Program</h2>
          <p className="text-xs text-slate-500">Schedule and approve monthly doctor and chemist visits by territory</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
            + Create New MTP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Planned Doctor Visits', count: '1,420', label: 'August 2026 Schedule', icon: Stethoscope, color: 'indigo' },
          { title: 'Chemists Covered', count: '680', label: '84% Coverage', icon: Building2, color: 'emerald' },
          { title: 'Joint Work Days', count: '28 Days', label: 'Area Manager Sync', icon: UserCheck, color: 'blue' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.count}</p>
              <p className="text-[11px] text-indigo-600 mt-0.5">{card.label}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Territory Visit Route Schedule</h3>
        <div className="space-y-3">
          {[
            { date: 'Aug 04, 2026', territory: 'South Delhi Zone', doctors: 12, chemists: 5, status: 'IN PROGRESS' },
            { date: 'Aug 05, 2026', territory: 'Gurgaon Cyber City', doctors: 15, chemists: 8, status: 'APPROVED' },
            { date: 'Aug 06, 2026', territory: 'Noida Sector 62', doctors: 10, chemists: 4, status: 'APPROVED' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">{item.date} — {item.territory}</p>
                  <p className="text-[11px] text-slate-500">{item.doctors} Doctors • {item.chemists} Chemists planned</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold text-[10px] border border-indigo-200">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
