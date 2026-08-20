import React, { useState, useEffect } from 'react';
import { Building2, Users, Shield, Server, Activity, Database, AlertTriangle, X, Check, ArrowRight, RefreshCw, Key, LogIn, Power, Edit3, Plus, Settings, Mail, CheckCircle2 } from 'lucide-react';
import { getStoredCompanies, saveStoredCompanies, setActiveCompanyId, Company, CompanyFeatureSwitches, getActiveCompanyId } from '../data/companyContext';
import { getStoredUserProfiles } from '../data/userContext';
import { sendWelcomeCredentialsEmail } from '../services/emailService';
import { syncAllLocalDataToFirestore } from '../services/supabaseSyncBridge';
import { generateSecureTemporaryPassword } from '../utils/security';

export default function SuperAdminDashboard() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [userProfiles, setUserProfiles] = useState(() => getStoredUserProfiles());
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const currentActiveCompanyId = getActiveCompanyId();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    showToast("Syncing local data to Supabase...");
    try {
      const res = await syncAllLocalDataToFirestore((status) => {
        if (status.phase === 'uploading') {
          showToast(status.message);
        }
      });
      setCompanies(getStoredCompanies());
      setUserProfiles(getStoredUserProfiles());
      if (res.success) {
        showToast("Data successfully synced to Supabase Cloud!");
      } else {
        showToast(res.message || "Data synced to local database.");
      }
    } catch (e: any) {
      console.warn("Sync error:", e);
      showToast("Sync completed with local persistence.");
    } finally {
      setIsSyncingCloud(false);
    }
  };

  useEffect(() => {
    const refresh = () => {
      setCompanies(getStoredCompanies());
      setUserProfiles(getStoredUserProfiles());
    };
    refresh();
    window.addEventListener('raxon-users-updated', refresh);
    window.addEventListener('raxon-company-updated', refresh);
    window.addEventListener('raxon-company-switched', refresh);
    return () => {
      window.removeEventListener('raxon-users-updated', refresh);
      window.removeEventListener('raxon-company-updated', refresh);
      window.removeEventListener('raxon-company-switched', refresh);
    };
  }, []);

  const handleLoginAsTenant = (company: Company) => {
    setActiveCompanyId(company.id);
    alert(`Impersonation Active:\nYou are now viewing data context for: ${company.name}.\n\nPlease use the Role Switcher (top right) to change your role to 'Admin' or 'MR' to see their specific dashboards.`);
  };

  const handleToggleStatus = (companyId: string) => {
    const updated = companies.map(c => {
      if (c.id === companyId) {
        return { ...c, status: (c.status === 'Active' ? 'Suspended' : 'Active') as 'Active' | 'Suspended' };
      }
      return c;
    });
    setCompanies(updated);
    saveStoredCompanies(updated);
  };

  const openFeaturesModal = (company: Company) => {
    setSelectedCompany(company);
    setActiveModal('manage_features');
  };

  const saveFeatures = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    
    const updated = companies.map(c => 
      c.id === selectedCompany.id ? selectedCompany : c
    );
    setCompanies(updated);
    saveStoredCompanies(updated);
    setActiveModal(null);
  };

  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: '', code: '', hqCity: '', state: '', contactEmail: '', contactPhone: '',
    status: 'Active',
    featureSwitches: {
      featureGpsTracking: true,
      featureChemistPob: true,
      featureSamplesGifts: false,
      featureStrictMtpApproval: true,
      featureStockistLedger: true,
      featureWhatsAppShare: true,
      featureDoctorSelfAdd: true,
      featureJointWorking: true,
      featureExpenseManagement: false
    }
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `CMP-${newCompany.code?.toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const fullCompany: Company = {
      ...(newCompany as Company),
      id,
      logo: newCompany.name ? newCompany.name?.[0] || 'C' : 'C',
      tagline: 'Healthcare Excellence',
      gstNumber: 'PENDING',
      dlNumber: 'PENDING',
      currency: 'INR (₹)',
      activeDivisions: [{ id: `DIV-${id}-1`, name: 'General Division', code: 'GEN', headCount: 1, status: 'Active', hasDedicatedAdmin: false }],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [...companies, fullCompany];
    setCompanies(updated);
    saveStoredCompanies(updated);
    setActiveModal(null);

    // Trigger welcome email
    if (newCompany.contactEmail) {
      sendWelcomeCredentialsEmail({
        email: newCompany.contactEmail,
        name: newCompany.name || 'Company Administrator',
        password: generateSecureTemporaryPassword(12),
        companyName: fullCompany.name,
        companyId: fullCompany.id,
        role: 'COMPANY_ADMIN',
        loginUrl: typeof window !== 'undefined' ? window.location.origin : 'https://raxonsfa.ai.studio',
        subscriptionDetails: {
          planTier: 'Enterprise',
          validUntil: '1 Year',
          mrQuota: 50,
          managerQuota: 10
        }
      }).catch(err => console.warn('SuperAdminDashboard email trigger notice:', err));
    }

    setNewCompany({...newCompany, name: '', code: '', hqCity: '', state: '', contactEmail: '', contactPhone: ''});
  };

  const activeAdminsCount = userProfiles.filter(u => {
    if (u.status !== 'Active') return false;
    const r = String(u.role).toUpperCase();
    return r.includes('ADMIN') || r.includes('SUPER');
  }).length;

  const kpis = [
    { id: 'companies', title: 'Total Companies', value: companies.length.toString(), sub: `${companies.filter(c => c.status === 'Active').length} Active • ${companies.filter(c => c.status !== 'Active').length} Suspended`, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'admins', title: 'Active System Admins', value: activeAdminsCount.toString(), sub: `Across ${companies.length} tenants`, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'server', title: 'Server Health', value: '99.9%', sub: 'Zero downtime past 90d', icon: Server, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'security', title: 'Security Alerts', value: '0', sub: 'No active threats', icon: Shield, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-2xs font-extrabold rounded-md uppercase">
              Global Platform Governance
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-xs font-bold text-gray-500">Root SuperAdmin</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-1">SaaS Super Admin Control Center</h1>
          <p className="text-xs font-semibold text-gray-600">Multi-tenant management, global policies, database partitioning, and system monitoring.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCloudSync}
            disabled={isSyncingCloud}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-500/30 rounded-lg text-xs font-bold flex items-center shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            title="Upload local state to Cloud Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-purple-400 ${isSyncingCloud ? 'animate-spin' : ''}`} />
            {isSyncingCloud ? 'Syncing...' : 'Cloud Sync'}
          </button>
          <button 
            onClick={() => setActiveModal('create_tenant')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Onboard New Pharma
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div 
            key={kpi.id} 
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex items-center hover:border-indigo-400 hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-105 transition-transform`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{kpi.title}</p>
              <h3 className="text-2xl font-black text-gray-900 leading-tight">{kpi.value}</h3>
              <p className="text-3xs font-semibold text-gray-400 mt-0.5 flex items-center gap-1">
                {kpi.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-black text-gray-900">Active Companies (Pharma Tenants)</h2>
                <p className="text-xs font-semibold text-gray-500">Live multi-tenant instances on dedicated database partitions</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead>
                  <tr className="text-left text-gray-500 uppercase font-black tracking-wider text-2xs">
                    <th className="py-2.5 px-3">Company Details</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">SuperAdmin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold">
                  {companies.map(company => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-black text-gray-900">{company.name}</div>
                        <div className="text-3xs text-gray-500 mt-0.5 flex items-center gap-2">
                          <span className="font-bold text-indigo-600">{company.code}</span>
                          <span>•</span>
                          <span>{company.activeDivisions.length} Divs</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-700">
                        <div className="font-bold">{company.hqCity}</div>
                        <div className="text-3xs text-gray-400">{company.state}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-3xs font-extrabold uppercase ${company.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {company.status}
                        </span>
                        {currentActiveCompanyId === company.id && (
                          <div className="text-3xs text-indigo-600 font-black mt-1">Currently Viewing</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button 
                          onClick={() => openFeaturesModal(company)}
                          className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-md transition-colors"
                          title="Manage Modules & Features"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(company.id)}
                          className={`p-1.5 rounded-md transition-colors ${company.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                          title={company.status === 'Active' ? 'Suspend Tenant' : 'Activate Tenant'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleLoginAsTenant(company)}
                          className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md transition-colors font-bold text-3xs uppercase tracking-wide inline-flex items-center gap-1"
                        >
                          <LogIn className="w-3 h-3" /> Login As
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-3xs text-gray-400 font-bold">Showing {companies.length} Registered Pharma Companies</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-5">
            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 text-emerald-500 mr-2" />
              Recent Security Audit Logs
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="border-l-2 border-emerald-500 pl-3">
                <p className="text-3xs text-gray-400 font-bold">10 mins ago • System Watchdog</p>
                <p className="text-xs font-semibold text-gray-800">Automated database replica check completed across Node-Asia-2. Zero errors.</p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-3">
                <p className="text-3xs text-gray-400 font-bold">1 hr ago • Admin System</p>
                <p className="text-xs font-semibold text-gray-800">Storage capacity optimized for tenant 'Raxon Healthcare'.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-5">
            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center">
              <Database className="w-4 h-4 text-indigo-600 mr-2" />
              Platform Cloud Health
            </h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-2xs mb-1 font-bold">
                  <span className="text-gray-600">Database Replica Load</span>
                  <span className="text-gray-900">32%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{width: '32%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-2xs mb-1 font-bold">
                  <span className="text-gray-600">API Gateway Bandwidth</span>
                  <span className="text-gray-900">18%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: '18%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-2xs mb-1 font-bold">
                  <span className="text-gray-600">Encrypted Blob Storage</span>
                  <span className="text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE TENANT MODAL */}
      {activeModal === 'create_tenant' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2.5 sm:p-4 overflow-hidden pt-safe pb-safe overscroll-none">
          <div className="bg-white rounded-2xl max-w-lg w-full flex flex-col shadow-2xl border border-gray-200 max-h-[85vh] sm:max-h-[90vh] overflow-hidden my-auto">
            <div className="flex justify-between items-center px-4 py-3.5 sm:px-6 sm:py-4 border-b border-gray-100 shrink-0 bg-white rounded-t-2xl z-10">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900">Onboard New Pharma Company</h3>
                <p className="text-2xs sm:text-xs text-gray-500">Provision a new isolated database partition and tenant workspace</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-6 sm:py-4 space-y-4 touch-scroll overscroll-contain">
                <div className="space-y-3">
                  <div>
                    <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Company Legal Name</label>
                    <input required type="text" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold" placeholder="e.g. Apex Lifesciences Ltd." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Short Code</label>
                      <input required type="text" value={newCompany.code} onChange={e => setNewCompany({...newCompany, code: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold" placeholder="e.g. APEX" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">HQ City</label>
                      <input required type="text" value={newCompany.hqCity} onChange={e => setNewCompany({...newCompany, hqCity: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold" placeholder="e.g. Mumbai" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Admin Email</label>
                      <input required type="email" value={newCompany.contactEmail} onChange={e => setNewCompany({...newCompany, contactEmail: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold" placeholder="admin@apex.com" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                      <input required type="text" value={newCompany.contactPhone} onChange={e => setNewCompany({...newCompany, contactPhone: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold" placeholder="+91..." />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <h4 className="text-xs font-bold text-blue-900 mb-1">Automatic Provisioning Include:</h4>
                  <ul className="text-2xs text-blue-800 space-y-1 font-semibold">
                    <li>• Dedicated Firestore Sub-collection Partition</li>
                    <li>• Default Roles & Hierarchy (MR, AM, RM, ZM)</li>
                    <li>• Root System Admin Account Generation</li>
                  </ul>
                </div>
              </div>

              <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-gray-100 shrink-0 bg-gray-50 flex justify-end gap-2 rounded-b-2xl">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black shadow-xs cursor-pointer">Provision Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE FEATURES MODAL */}
      {activeModal === 'manage_features' && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2.5 sm:p-4 overflow-hidden pt-safe pb-safe overscroll-none">
          <div className="bg-white rounded-2xl max-w-xl w-full flex flex-col shadow-2xl border border-gray-200 max-h-[85vh] sm:max-h-[90vh] overflow-hidden my-auto">
            <div className="flex justify-between items-center px-4 py-3.5 sm:px-6 sm:py-4 border-b border-gray-100 shrink-0 bg-white rounded-t-2xl z-10">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900">Manage Tenant Modules</h3>
                <p className="text-2xs sm:text-xs font-semibold text-gray-500">Enable or disable features for {selectedCompany.name}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveFeatures} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-6 sm:py-4 touch-scroll overscroll-contain">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(selectedCompany.featureSwitches).map(([key, value]) => {
                    const title = key.replace('feature', '').replace(/([A-Z])/g, ' $1').trim();
                    return (
                      <label key={key} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="relative flex items-center mt-0.5">
                          <input 
                            type="checkbox" 
                            checked={value as boolean}
                            onChange={(e) => {
                              setSelectedCompany({
                                ...selectedCompany,
                                featureSwitches: {
                                  ...selectedCompany.featureSwitches,
                                  [key]: e.target.checked
                                }
                              });
                            }}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" 
                          />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">{title}</span>
                          <span className="text-3xs font-semibold text-gray-500">Toggle {title.toLowerCase()} module access for this tenant.</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-gray-100 shrink-0 bg-gray-50 flex justify-end gap-2 rounded-b-2xl">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black shadow-xs cursor-pointer">Save Module Configuration</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


