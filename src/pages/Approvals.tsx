import React, { useState, useEffect } from 'react';
import { getPendingMTPs, approveMTP } from '../lib/api';
import { Modal } from '../components/Modal';
import { CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function Approvals() {
  const [pendingMTPs, setPendingMTPs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const mtps = await getPendingMTPs();
      setPendingMTPs(mtps);
    } catch (error) {
      console.error("Failed to load approvals", error);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveMTP(id);
      setPendingMTPs(prev => prev.filter(m => m.id !== id));
      setMessage("MTP Approved successfully!");
    } catch (error) {
      setMessage("Failed to approve MTP");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <Modal isOpen={!!message} onClose={() => setMessage('')} title="Notification">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={() => setMessage('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">OK</button>
        </div>
      </Modal>
      <h1 className="text-2xl font-bold text-gray-900">Manager Approvals</h1>
      <p className="text-gray-500">Review and approve MTPs for your team</p>

      {pendingMTPs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow border border-gray-200 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">All caught up!</h2>
          <p className="text-gray-500">No pending approvals at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingMTPs.map(mtp => (
            <div key={mtp.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{mtp.userName}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    Submitted: {mtp.submittedAt ? format(mtp.submittedAt.toDate(), 'dd MMM yyyy, HH:mm') : 'Recently'}
                  </p>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-700">Month: {mtp.monthYear}</h4>
                    <p className="text-sm text-gray-600 mt-2">Days Planned: {Object.keys(mtp.plans || {}).length}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleApprove(mtp.id)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium transition-colors">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium transition-colors">
                    Reject / Remark
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
