import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, ArrowUpRight } from 'lucide-react';

export const SalesView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Primary & Secondary Sales</h2>
          <p className="text-xs text-slate-500">Distributor orders, stockist billings, and revenue targets</p>
        </div>
        <button className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs">
          + Book New Primary Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Primary Sales Target</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">$600,000</h3>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div className="bg-indigo-600 h-2 rounded-full w-[80%]" />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 text-right">80% Achieved ($482,900)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Secondary Sales (Chemists)</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">$310,400</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14% vs last month
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Pending Order Value</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">$45,200</h3>
          <p className="text-xs text-slate-500 mt-1">6 Distributor Orders Awaiting Approval</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900">
          Recent Distributor Orders
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Distributor</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: 'ORD-9921', name: 'Apex Pharma Distributors', items: '12 Box Raxon-CV', amount: '$18,400', date: 'Aug 04, 2026', status: 'COMPLETED' },
                { id: 'ORD-9922', name: 'City Healthcare Stockists', items: '25 Box CardioPlus', amount: '$24,100', date: 'Aug 03, 2026', status: 'COMPLETED' },
                { id: 'ORD-9923', name: 'Metro Medical Suppliers', items: '5 Box VitaminD3', amount: '$2,700', date: 'Aug 03, 2026', status: 'PENDING' }
              ].map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{row.id}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{row.name}</td>
                  <td className="p-3.5 text-slate-500">{row.items}</td>
                  <td className="p-3.5 font-bold text-slate-900">{row.amount}</td>
                  <td className="p-3.5 text-slate-500">{row.date}</td>
                  <td className="p-3.5 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
