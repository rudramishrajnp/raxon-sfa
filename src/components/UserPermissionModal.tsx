import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Stethoscope, Building2, AlertCircle, Sparkles, Lock, Unlock, RotateCcw, Navigation, MapPin } from 'lucide-react';
import { UserPermissions, getUserPermissions, saveUserPermission, getDefaultPermissionsForRole } from '../data/permissionSettings';
import { Employee } from '../pages/UserManagement';

interface UserPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Employee | null;
  onSaved?: (user: Employee, perms: UserPermissions) => void;
}

export function UserPermissionModal({ isOpen, onClose, user, onSaved }: UserPermissionModalProps) {
  const [perms, setPerms] = useState<UserPermissions>({
    canEditDoctor: false,
    canDeleteDoctor: false,
    canEditChemist: false,
    canDeleteChemist: false,
    canAddDoctor: true,
    canAddChemist: true,
    isGeolocationEnabled: true,
  });

  useEffect(() => {
    if (user) {
      setPerms(getUserPermissions(user.id, user.role));
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleToggle = (key: keyof UserPermissions) => {
    setPerms(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleApplyPreset = (preset: 'full' | 'editOnly' | 'viewOnly' | 'default') => {
    if (preset === 'full') {
      setPerms(prev => ({
        ...prev,
        canEditDoctor: true,
        canDeleteDoctor: true,
        canEditChemist: true,
        canDeleteChemist: true,
        canAddDoctor: true,
        canAddChemist: true,
      }));
    } else if (preset === 'editOnly') {
      setPerms(prev => ({
        ...prev,
        canEditDoctor: true,
        canDeleteDoctor: false,
        canEditChemist: true,
        canDeleteChemist: false,
        canAddDoctor: true,
        canAddChemist: true,
      }));
    } else if (preset === 'viewOnly') {
      setPerms(prev => ({
        ...prev,
        canEditDoctor: false,
        canDeleteDoctor: false,
        canEditChemist: false,
        canDeleteChemist: false,
        canAddDoctor: false,
        canAddChemist: false,
      }));
    } else if (preset === 'default') {
      setPerms(getDefaultPermissionsForRole(user.role));
    }
  };

  const handleSave = () => {
    saveUserPermission(user.id, perms);
    if (onSaved) {
      onSaved(user, perms);
    }
    onClose();
  };

  const isRoleAdmin = user.role.toLowerCase().includes('admin');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 transform transition-all animate-in zoom-in-95 duration-150 flex flex-col max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-5 sm:p-6 text-white flex items-start justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/20">
              <Shield className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Doctor & Chemist Permission Manager</h3>
              <p className="text-xs text-indigo-200 mt-0.5">
                Master Edit and Delete Permission Controls
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Header */}
        <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 text-base">{user.name}</span>
              <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md font-semibold">
                {user.id}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              {user.role} • {user.hq}
            </p>
          </div>

          {/* Preset Buttons */}
          {!isRoleAdmin && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleApplyPreset('full')}
                className="px-2.5 py-1 text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                + Full Access
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('editOnly')}
                className="px-2.5 py-1 text-2xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                Edit Only
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('default')}
                className="px-2.5 py-1 text-2xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Reset
              </button>
            </div>
          )}
        </div>

        {/* Content Body with Toggles */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {isRoleAdmin ? (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-sm flex items-start space-x-3">
              <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">System Administrator Account</p>
                <p className="text-xs text-indigo-700 mt-1">
                  Administrator accounts have permanent active edit and delete permissions for all doctors and chemists.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Doctor Permissions Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5">
                  <Stethoscope className="w-4 h-4 text-indigo-600" />
                  <span>Doctor Directory & Masters Control</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Doctor Edit Toggle */}
                  <div 
                    onClick={() => handleToggle('canEditDoctor')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                      perms.canEditDoctor 
                        ? 'border-indigo-300 bg-indigo-50/50 shadow-2xs' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold text-gray-900">Edit Doctor</span>
                        {perms.canEditDoctor ? (
                          <span className="text-3xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 font-bold rounded">ENABLED</span>
                        ) : (
                          <span className="text-3xs px-1.5 py-0.5 bg-gray-100 text-gray-500 font-bold rounded">DISABLED</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Permission to edit doctor name, specialty, phone and address.
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      perms.canEditDoctor ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {perms.canEditDoctor ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Doctor Delete Toggle */}
                  <div 
                    onClick={() => handleToggle('canDeleteDoctor')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                      perms.canDeleteDoctor 
                        ? 'border-red-300 bg-red-50/50 shadow-2xs' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold text-gray-900">Delete Doctor</span>
                        {perms.canDeleteDoctor ? (
                          <span className="text-3xs px-1.5 py-0.5 bg-red-100 text-red-700 font-bold rounded">ENABLED</span>
                        ) : (
                          <span className="text-3xs px-1.5 py-0.5 bg-gray-100 text-gray-500 font-bold rounded">DISABLED</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Permission to permanently remove doctor from directory and master records.
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      perms.canDeleteDoctor ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {perms.canDeleteDoctor ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chemist Permissions Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Chemist Directory & Masters Control</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Chemist Edit Toggle */}
                  <div 
                    onClick={() => handleToggle('canEditChemist')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                      perms.canEditChemist 
                        ? 'border-emerald-300 bg-emerald-50/50 shadow-2xs' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold text-gray-900">Edit Chemist</span>
                        {perms.canEditChemist ? (
                          <span className="text-3xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">ENABLED</span>
                        ) : (
                          <span className="text-3xs px-1.5 py-0.5 bg-gray-100 text-gray-500 font-bold rounded">DISABLED</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Permission to update chemist shop, proprietor and contact details.
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      perms.canEditChemist ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {perms.canEditChemist ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Chemist Delete Toggle */}
                  <div 
                    onClick={() => handleToggle('canDeleteChemist')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                      perms.canDeleteChemist 
                        ? 'border-red-300 bg-red-50/50 shadow-2xs' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold text-gray-900">Delete Chemist</span>
                        {perms.canDeleteChemist ? (
                          <span className="text-3xs px-1.5 py-0.5 bg-red-100 text-red-700 font-bold rounded">ENABLED</span>
                        ) : (
                          <span className="text-3xs px-1.5 py-0.5 bg-gray-100 text-gray-500 font-bold rounded">DISABLED</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Permission to delete chemist shop from directory and master records.
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      perms.canDeleteChemist ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {perms.canDeleteChemist ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Geolocation Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span>Field Geolocation & GPS Tracking Control</span>
                </div>

                <div 
                  onClick={() => handleToggle('isGeolocationEnabled')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                    perms.isGeolocationEnabled 
                      ? 'border-emerald-400 bg-emerald-50/60 shadow-2xs' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="pr-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <Navigation className={`w-4 h-4 ${perms.isGeolocationEnabled ? 'text-emerald-600 animate-pulse' : 'text-gray-400'}`} />
                        Userwise Geolocation (GPS Tracking & Punch-in)
                      </span>
                      {perms.isGeolocationEnabled ? (
                        <span className="text-3xs px-1.5 py-0.5 bg-emerald-200 text-emerald-900 font-bold rounded">GPS ACTIVE</span>
                      ) : (
                        <span className="text-3xs px-1.5 py-0.5 bg-gray-100 text-gray-500 font-bold rounded">GPS DISABLED</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Enforce GPS location capture for this employee during DCR submission, call punch-in, and live field tracking.
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    perms.isGeolocationEnabled ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {perms.isGeolocationEnabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <b>System Admin Note:</b> When employee permissions are disabled, edit and delete buttons in the doctor/chemist directory will be locked or hidden.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          {!isRoleAdmin && (
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Permissions</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
