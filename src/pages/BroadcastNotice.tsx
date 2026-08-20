import React, { useState, useEffect } from 'react';
import { 
  Bell, Send, Plus, Search, Filter, CheckCircle2, Eye, Pin, FileText, AlertTriangle, 
  Users, MessageSquare, Sparkles, Clock, MapPin, Tag
} from 'lucide-react';
import { getActiveCompanyId, getActiveCompany } from '../data/companyContext';
import { getUsersByCompany } from '../data/userContext';
import { getAllHeadquarters } from '../data/hqMrMapping';

interface CircularNotice {
  id: string;
  title: string;
  category: 'Price Revision' | 'New Product Launch' | 'Sales Circular' | 'Monthly Scheme' | 'General Notice';
  priority: 'Urgent' | 'High' | 'Normal';
  message: string;
  targetAudience: string; // 'All Field Reps', 'Lucknow HQ', 'General Division'
  createdAt: string;
  postedBy: string;
  isPinned: boolean;
  readCount: number;
  totalRecipients: number;
  readByEmployees: { id: string; name: string; readAt: string }[];
}

export default function BroadcastNotice() {
  const activeCompanyId = getActiveCompanyId();
  const company = getActiveCompany();
  const employees = getUsersByCompany(activeCompanyId);
  const existingHqs = getAllHeadquarters(activeCompanyId);

  const loadNotices = (): CircularNotice[] => {
    try {
      const saved = localStorage.getItem(`raxon_broadcasts_${activeCompanyId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'BRD-01',
        title: 'New Product Launch: Pantoprazole 40mg + Domperidone 30mg (Capsules)',
        category: 'New Product Launch',
        priority: 'High',
        message: 'Dear Team, We are thrilled to announce the pan-India launch of our new PPI combination. Visual aids, doctor samples, and introductory schemes (10+2 free) are now available in your HQ inventory. Please prioritize in your upcoming doctor calls.',
        targetAudience: 'All Field Reps',
        createdAt: '2026-08-15 09:30 AM',
        postedBy: 'Marketing & Product Strategy Team',
        isPinned: true,
        readCount: 14,
        totalRecipients: 18,
        readByEmployees: [
          { id: 'MR-01', name: 'Rahul Verma', readAt: '2026-08-15 10:05 AM' },
          { id: 'MR-02', name: 'Pooja Sharma', readAt: '2026-08-15 10:18 AM' },
          { id: 'AM-01', name: 'Rameshwar Patil', readAt: '2026-08-15 09:45 AM' }
        ]
      },
      {
        id: 'BRD-02',
        title: 'Q2 Sales Incentive Slabs & Independence Day Special Target Scheme',
        category: 'Monthly Scheme',
        priority: 'Urgent',
        message: 'All MRs achieving ≥105% secondary sales target by 25th August will receive an additional 3% cash bonus along with an exclusive appreciation certificate from the Managing Director.',
        targetAudience: 'All Field Reps',
        createdAt: '2026-08-14 11:00 AM',
        postedBy: 'National Sales Head',
        isPinned: true,
        readCount: 17,
        totalRecipients: 18,
        readByEmployees: [
          { id: 'MR-01', name: 'Rahul Verma', readAt: '2026-08-14 11:15 AM' },
          { id: 'MR-02', name: 'Pooja Sharma', readAt: '2026-08-14 11:30 AM' }
        ]
      },
      {
        id: 'BRD-03',
        title: 'Revised GST & Price List Effective from 1st September 2026',
        category: 'Price Revision',
        priority: 'Normal',
        message: 'Please find updated PTS & PTR rates for all antibiotic liquids and pain relief segments. Share the new stockist order sheet with authorized distributors.',
        targetAudience: 'Lucknow HQ',
        createdAt: '2026-08-10 03:20 PM',
        postedBy: 'Commercial & Accounts Admin',
        isPinned: false,
        readCount: 8,
        totalRecipients: 10,
        readByEmployees: [
          { id: 'MR-01', name: 'Rahul Verma', readAt: '2026-08-10 04:00 PM' }
        ]
      }
    ];
  };

  const [notices, setNotices] = useState<CircularNotice[]>(loadNotices);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [viewNotice, setViewNotice] = useState<CircularNotice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compose State
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Sales Circular' as CircularNotice['category'],
    priority: 'Normal' as CircularNotice['priority'],
    message: '',
    targetAudience: 'All Field Reps',
    isPinned: false
  });

  useEffect(() => {
    localStorage.setItem(`raxon_broadcasts_${activeCompanyId}`, JSON.stringify(notices));
  }, [notices, activeCompanyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleComposeNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const notice: CircularNotice = {
      id: `BRD-${Date.now().toString().slice(-4)}`,
      title: newNotice.title,
      category: newNotice.category,
      priority: newNotice.priority,
      message: newNotice.message,
      targetAudience: newNotice.targetAudience,
      createdAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      postedBy: `${company.name} Corporate Admin`,
      isPinned: newNotice.isPinned,
      readCount: 1,
      totalRecipients: employees.length || 15,
      readByEmployees: [
        { id: 'ADMIN-01', name: 'Company Admin', readAt: new Date().toLocaleTimeString() }
      ]
    };

    setNotices([notice, ...notices]);
    showToast(`Notice "${notice.title}" broadcasted to ${notice.targetAudience}!`);
    setIsComposeModalOpen(false);
    setNewNotice({
      title: '',
      category: 'Sales Circular',
      priority: 'Normal',
      message: '',
      targetAudience: 'All Field Reps',
      isPinned: false
    });
  };

  const handleTogglePin = (id: string) => {
    setNotices(notices.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    showToast('Notice pinned status updated.');
  };

  const filteredNotices = notices.filter(n => {
    const matchCat = categoryFilter === 'ALL' ? true : n.category === categoryFilter;
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white text-xs ml-2">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Broadcast, Circular & Notice Board</h1>
            <p className="text-xs text-gray-500">
              Publish company circulars, product launches, price revisions, monthly schemes & track MR read receipts.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsComposeModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-4 h-4" /> Broadcast New Circular
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Categories</option>
              <option value="New Product Launch">New Product Launch</option>
              <option value="Monthly Scheme">Monthly Scheme</option>
              <option value="Price Revision">Price Revision</option>
              <option value="Sales Circular">Sales Circular</option>
              <option value="General Notice">General Notice</option>
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search circulars & notices..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Notice Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center text-gray-500">
            No notices found. Click "Broadcast New Circular" to publish your first announcement.
          </div>
        ) : (
          filteredNotices.map(notice => {
            const readPercentage = notice.totalRecipients > 0 ? Math.round((notice.readCount / notice.totalRecipients) * 100) : 0;
            return (
              <div 
                key={notice.id} 
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-3 ${
                  notice.isPinned ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {notice.isPinned && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                        <Pin className="w-3 h-3" /> PINNED
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      notice.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                      notice.priority === 'High' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {notice.priority}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold">
                      {notice.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {notice.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePin(notice.id)}
                      className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title={notice.isPinned ? 'Unpin' : 'Pin to Top'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewNotice(notice)}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Read Receipts ({notice.readCount}/{notice.totalRecipients})
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-gray-900">{notice.title}</h3>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed whitespace-pre-line">{notice.message}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">Target:</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-[11px] font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-600" /> {notice.targetAudience}
                    </span>
                    <span>• Posted by <strong className="text-gray-800">{notice.postedBy}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-700">
                      {readPercentage}% MRs Acknowledged
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${readPercentage}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Read Receipts Modal */}
      {viewNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Read Receipts & Acknowledgments</h3>
                <p className="text-3xs text-gray-500 mt-0.5">{viewNotice.title}</p>
              </div>
              <button onClick={() => setViewNotice(null)} className="text-gray-400 hover:text-gray-600 text-sm p-1 rounded-lg hover:bg-gray-100 cursor-pointer">✕</button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-700">
                Acknowledged by {viewNotice.readByEmployees.length} team members:
              </div>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden text-xs">
                {viewNotice.readByEmployees.map((emp, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between bg-white hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-gray-900">{emp.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{emp.readAt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewNotice(null)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Notice Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-600" /> Broadcast Circular / Notice
              </h3>
              <button onClick={() => setIsComposeModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm p-1 rounded-lg hover:bg-gray-100 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleComposeNotice} className="space-y-3.5 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notice / Circular Headline *</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. New Product Launch: Azithromycin 250mg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={newNotice.category}
                    onChange={e => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="New Product Launch">New Product Launch</option>
                    <option value="Monthly Scheme">Monthly Scheme</option>
                    <option value="Price Revision">Price Revision</option>
                    <option value="Sales Circular">Sales Circular</option>
                    <option value="General Notice">General Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Priority Level</label>
                  <select
                    value={newNotice.priority}
                    onChange={e => setNewNotice({ ...newNotice, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Audience</label>
                <select
                  value={newNotice.targetAudience}
                  onChange={e => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="All Field Reps">All Field Reps (Pan-India)</option>
                  {existingHqs.map(h => (
                    <option key={h.id || h.name} value={`${h.name} Only`}>{h.name} Only</option>
                  ))}
                  <option value="Managers (AM / RM / ZM)">Managers (AM / RM / ZM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Circular Message Body *</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.message}
                  onChange={e => setNewNotice({ ...newNotice, message: e.target.value })}
                  placeholder="Write clear instructions, scheme details, or launch pointers for the team..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newNotice.isPinned}
                  onChange={e => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pinCheck" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Pin this circular to the top of all field apps
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsComposeModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
