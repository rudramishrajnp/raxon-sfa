import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, MapPin, Building2, Shield, Lock, 
  CheckCircle2, AlertCircle, Eye, EyeOff, Save, Key, Briefcase
} from 'lucide-react';
import { UserProfile, updateUserPassword } from '../data/userContext';
import { getActiveCompany } from '../data/companyContext';
import { supabase } from '../supabaseClient';

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export default function UserProfileModal({ user, isOpen, onClose, onLogout }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'change_password'>('details');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const activeCompany = getActiveCompany();

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate new password
    if (newPasswordInput.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    // Verify current credentials with Supabase Auth if email is available
    if (user.email) {
      try {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPasswordInput
        });
        if (signInErr) {
          setErrorMessage('Incorrect current password! Please enter your correct current password.');
          return;
        }
      } catch (authErr) {
        console.warn('Re-auth check error:', authErr);
      }
    }

    const result = await updateUserPassword(newPasswordInput);
    if (result.success) {
      setSuccessMessage('Password successfully updated! Please use your new password next time you sign in.');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setTimeout(() => {
        setSuccessMessage('');
        setActiveTab('details');
      }, 2000);
    } else {
      setErrorMessage(result.error || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden my-auto flex flex-col max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)]">
        
        {/* Modal Top Header with Avatar */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-5 sm:p-6 text-white text-center shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Avatar Circle */}
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600 border-2 border-indigo-400 text-white font-black text-xl shadow-lg mb-2">
            {user.initials || 'RP'}
          </div>

          <h3 className="text-lg font-black tracking-tight text-white">{user.name}</h3>
          <p className="text-xs text-indigo-300 font-bold mt-0.5">{user.roleTitle}</p>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-3xs font-mono text-indigo-200 font-bold">
            <Key className="w-3 h-3 text-amber-400" />
            <span>User ID: {user.id}</span>
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 p-1.5 gap-1.5 shrink-0">
          <button
            onClick={() => { setActiveTab('details'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'details'
                ? 'bg-white text-indigo-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Personal Details
          </button>

          <button
            onClick={() => { setActiveTab('change_password'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'change_password'
                ? 'bg-white text-indigo-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Change Password
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'details' && (
            <div className="p-5 sm:p-6 space-y-4">
            <div className="space-y-3 text-xs">
              
              {/* Designation / Role */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-3xs text-gray-500 font-bold uppercase">Designation & Authority</div>
                  <div className="text-xs font-black text-gray-900 truncate">{user.roleTitle}</div>
                </div>
              </div>

              {/* Headquarter / HQ */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-3xs text-gray-500 font-bold uppercase">Operational HQ & Territory</div>
                  <div className="text-xs font-black text-gray-900 truncate">{user.hq}</div>
                  {user.territory && (
                    <div className="text-3xs text-gray-500 font-medium truncate">{user.territory}</div>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-3xs text-gray-500 font-bold uppercase">Official Email ID</div>
                  <div className="text-xs font-black text-gray-900 font-mono truncate">{user.email}</div>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-3xs text-gray-500 font-bold uppercase">Registered Mobile Number</div>
                  <div className="text-xs font-black text-gray-900 font-mono truncate">{user.phone}</div>
                </div>
              </div>

              {/* Organization / Company */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-3xs text-gray-500 font-bold uppercase">Organization & Division</div>
                  <div className="text-xs font-black text-gray-900 truncate">
                    {user.companyName || activeCompany.name}
                  </div>
                  {user.divisionName && (
                    <div className="text-3xs text-purple-700 font-bold truncate">{user.divisionName}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('change_password')}
                className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-indigo-200"
              >
                <Lock className="w-3.5 h-3.5" />
                Change Password
              </button>
              
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CHANGE PASSWORD */}
        {activeTab === 'change_password' && (
          <form onSubmit={handlePasswordChangeSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Status alerts */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-3xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Purana password darj karein"
                  required
                  className="w-full p-2.5 pl-9 pr-9 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-3xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Naya password banayein (min 4 chars)"
                  required
                  className="w-full p-2.5 pl-9 pr-9 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-3xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Naye password ko dobara likhein"
                  required
                  className="w-full p-2.5 pl-9 pr-9 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save New Password
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
