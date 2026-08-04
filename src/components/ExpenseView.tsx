import React from 'react';
import { Receipt, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const ExpenseView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Expense Claims & TA/DA Allowances</h2>
          <p className="text-xs text-slate-500">Travel allowances, daily food allowances, and hotel bill submission</p>
        </div>
        <button className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs">
          + File Expense Claim
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900">
          Pending Field Expenses
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {[
            { id: 'EXP-401', rep: 'Dr. Rahul Sharma', type: 'Travel Allowance (TA) - Fuel', amount: '$42.00', date: 'Aug 03, 2026', status: 'PENDING' },
            { id: 'EXP-402', rep: 'Priya Patel', type: 'Outstation Hotel Stay & Food', amount: '$128.50', date: 'Aug 02, 2026', status: 'APPROVED' },
            { id: 'EXP-403', rep: 'Amit Kumar', type: 'Daily Allowance (DA)', amount: '$25.00', date: 'Aug 01, 2026', status: 'APPROVED' }
          ].map((exp) => (
            <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{exp.rep}</p>
                  <p className="text-slate-500">{exp.type} • {exp.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900 text-sm">{exp.amount}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  exp.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {exp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
