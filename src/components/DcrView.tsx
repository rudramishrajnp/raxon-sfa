import React from 'react';
import { FileText, Plus, Gift, Package, ThumbsUp } from 'lucide-react';

export const DcrView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Daily Call Reports (DCR)</h2>
          <p className="text-xs text-slate-500">Log doctor interactions, sample distributions, and product detailing feedback</p>
        </div>
        <button className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-xs">
          <Plus className="w-4 h-4" /> Log New Doctor Call
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Logged Calls for Today (Aug 04, 2026)</h3>

        <div className="space-y-3">
          {[
            {
              doctor: 'Dr. A. K. Verma',
              specialty: 'Cardiologist',
              hospital: 'Apollo Super Specialty',
              products: ['Raxon-CV 20mg', 'CardioPlus 5mg'],
              samples: '2 Units Raxon-CV',
              feedback: 'Positive response on new clinical trial data. Requested 5 additional samples next week.',
              time: '11:20 AM'
            },
            {
              doctor: 'Dr. Meena Gupta',
              specialty: 'Pediatrician',
              hospital: 'Lifeline Childrens Clinic',
              products: ['KiddieCough Syrup', 'VitaminD3 Drops'],
              samples: '5 Units VitaminD3',
              feedback: 'Agreed to prescribe KiddieCough for monsoon season. Stock available with local chemist.',
              time: '02:15 PM'
            }
          ].map((call, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{call.doctor}</h4>
                  <p className="text-slate-500">{call.specialty} • {call.hospital}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                  {call.time}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {call.products.map((p, pIdx) => (
                  <span key={pIdx} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-[10px] font-medium border border-indigo-200">
                    {p}
                  </span>
                ))}
              </div>

              <p className="text-slate-700 pt-1 leading-relaxed"><span className="font-semibold">Feedback:</span> {call.feedback}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <Gift className="w-3.5 h-3.5 text-amber-500" />
                <span>Sample Provided: <strong className="text-slate-800">{call.samples}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
