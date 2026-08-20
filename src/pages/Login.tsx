import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  EyeOff,
  Fingerprint,
  ScanFace,
  Sparkles,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { RaxonIcon } from '../components/RaxonLogo';
import { getStoredUserProfiles, UserProfile, normalizeRole, saveStoredUserProfiles } from '../data/userContext';
import { supabase } from '../supabaseClient';

import { 
  getBiometricStatus, 
  authenticateWithBiometrics, 
  saveBiometricUser, 
  BiometricStatus,
  clearBiometricUser
} from '../services/biometricAuth';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [userIdInput, setUserIdInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Biometric state
  const [biometricStatus, setBiometricStatus] = useState<BiometricStatus | null>(null);
  const [isBiometricAuthenticating, setIsBiometricAuthenticating] = useState(false);
  const [biometricSuccessMessage, setBiometricSuccessMessage] = useState('');

  // Check biometric availability on mount
  useEffect(() => {
    async function initBiometrics() {
      try {
        const status = await getBiometricStatus();
        setBiometricStatus(status);
        if (status.enrolledUserId && !userIdInput) {
          const currentProfiles = getStoredUserProfiles();
          const enrolled = currentProfiles.find(p => p.id === status.enrolledUserId);
          if (enrolled?.email) {
            setUserIdInput(enrolled.email);
          }
        }
      } catch (err) {
        console.error('Error initializing biometrics:', err);
      }
    }
    initBiometrics();
  }, []);

  const handleBiometricUnlock = async () => {
    setErrorMessage('');
    setBiometricSuccessMessage('');
    setIsBiometricAuthenticating(true);

    try {
      const authResult = await authenticateWithBiometrics(
        'Scan your fingerprint or Face ID to sign in to Raxon SFA'
      );

      if (!authResult.success) {
        setIsBiometricAuthenticating(false);
        if (authResult.error) {
          setErrorMessage(authResult.error);
        }
        return;
      }

      // Check for active Supabase Auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        setIsBiometricAuthenticating(false);
        setErrorMessage('Biometrics verified, but your session has expired. Please sign in with your password.');
        clearBiometricUser();
        return;
      }

      // Load user profile from Supabase
      const { data: profileRow, error: profileErr } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileErr || !profileRow) {
        setIsBiometricAuthenticating(false);
        setErrorMessage('User profile not found. Please sign in with your email and password.');
        return;
      }

      const userProfile = (profileRow.data || profileRow) as UserProfile;

      if (userProfile.status && userProfile.status !== 'Active') {
        setIsBiometricAuthenticating(false);
        setErrorMessage('Your account has been deactivated. Please contact your administrator.');
        return;
      }

      setBiometricSuccessMessage(`Verified! Signing in as ${userProfile.name}...`);
      saveBiometricUser(userProfile.id);
      
      setTimeout(() => {
        setIsBiometricAuthenticating(false);
        onLogin(userProfile);
      }, 500);

    } catch (err: unknown) {
      setIsBiometricAuthenticating(false);
      const errMessage = (err as Error)?.message || 'Biometric authentication failed.';
      setErrorMessage(errMessage);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanInput = userIdInput.trim().toLowerCase();

    if (!cleanInput) {
      setErrorMessage('Please enter your Mobile Number or Email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      let emailToAuth = cleanInput;

      // If the user did not enter an email format (e.g. mobile number or custom username), resolve email via server lookup
      if (!cleanInput.includes('@')) {
        try {
          const lookupRes = await fetch('/api/auth/lookup-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: cleanInput })
          });
          const lookupData = await lookupRes.json();
          if (lookupData?.email) {
            emailToAuth = lookupData.email.trim().toLowerCase();
          } else {
            setIsLoggingIn(false);
            setErrorMessage('Invalid email or password. Please check your credentials.');
            return;
          }
        } catch (lookupErr) {
          console.error('Email lookup error:', lookupErr);
          setIsLoggingIn(false);
          setErrorMessage('Unable to connect to the authentication server. Please check your internet connection.');
          return;
        }
      }

      // Supabase Auth as the single authoritative authentication system
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: password
      });

      if (authError || !authData?.user) {
        setIsLoggingIn(false);
        const errMsg = authError?.message || '';
        if (errMsg.toLowerCase().includes('failed to fetch') || errMsg.toLowerCase().includes('network')) {
          setErrorMessage('Unable to connect to the server. Please check your internet connection and try again.');
        } else {
          setErrorMessage('Invalid email or password. Please check your credentials.');
        }
        return;
      }

      const authUser = authData.user;

      // Authoritative profile retrieval from Supabase user_profiles
      let userProfile: UserProfile | null = null;

      const { data: profileRow, error: profileErr } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!profileErr && profileRow) {
        userProfile = (profileRow.data || profileRow) as UserProfile;
      }

      // If not found by auth UID (e.g. migration sync in progress), lookup by email
      if (!userProfile) {
        const { data: emailMatchRow } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', emailToAuth)
          .maybeSingle();

        if (emailMatchRow) {
          userProfile = (emailMatchRow.data || emailMatchRow) as UserProfile;
          userProfile.id = authUser.id;
          
          // Re-key profile record to Auth UID
          supabase.from('user_profiles').upsert({
            id: authUser.id,
            company_id: userProfile.companyId || (userProfile as any).company_id || '',
            role: userProfile.role || 'ADMIN',
            email: emailToAuth,
            name: userProfile.name,
            phone: userProfile.phone || '',
            status: userProfile.status || 'Active',
            data: userProfile,
            updated_at: new Date().toISOString()
          }).then(null, () => {});
        }
      }

      // If Super Admin profile is missing, generate authoritative Super Admin profile
      if (!userProfile && (emailToAuth === 'superadmin@raxon.cloud' || emailToAuth === 'superadmin@cloud.raxon.com')) {
        userProfile = {
          id: authUser.id,
          name: 'Platform Super Admin',
          email: emailToAuth,
          phone: '+91 00000 00000',
          role: 'SUPER_ADMIN',
          roleTitle: 'Platform Super Admin',
          companyId: '',
          companyName: 'Platform Super Admin',
          hq: 'Cloud Operations',
          territory: 'Global Platform Control',
          initials: 'SA',
          avatarBg: 'bg-purple-950',
          status: 'Active',
          metrics: {}
        };

        supabase.from('user_profiles').upsert({
          id: authUser.id,
          company_id: '',
          role: 'SUPER_ADMIN',
          email: emailToAuth,
          name: 'Platform Super Admin',
          status: 'Active',
          data: userProfile,
          updated_at: new Date().toISOString()
        }).then(null, () => {});
      }

      if (!userProfile) {
        setIsLoggingIn(false);
        setErrorMessage('Your account is authenticated, but your user profile is not configured. Please contact your administrator.');
        return;
      }

      // Check active status
      if (userProfile.status && userProfile.status !== 'Active') {
        setIsLoggingIn(false);
        setErrorMessage('Your account has been deactivated or suspended. Please contact your administrator.');
        return;
      }

      // Validate tenant isolation for non-superadmin users
      const normalizedRole = normalizeRole(userProfile.role);
      if (normalizedRole !== 'SUPER_ADMIN') {
        const companyId = userProfile.companyId || (userProfile as any).company_id;
        if (!companyId) {
          setIsLoggingIn(false);
          setErrorMessage('Your account is not assigned to an active company tenant. Please contact support.');
          return;
        }
      }

      // Biometrics configuration
      if (enableBiometrics) {
        saveBiometricUser(userProfile.id);
      }

      // Update local profile cache for UI transitions
      const currentProfiles = getStoredUserProfiles();
      saveStoredUserProfiles([userProfile, ...currentProfiles.filter(p => p.id !== userProfile!.id)]);

      setIsLoggingIn(false);
      onLogin(userProfile);

    } catch (err: any) {
      setIsLoggingIn(false);
      console.error("Login error:", err);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const isFaceId = biometricStatus?.biometryType === 'face';

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] pl-[calc(env(safe-area-inset-left,0px)+1rem)] pr-[calc(env(safe-area-inset-right,0px)+1rem)] text-slate-100 overflow-y-auto overscroll-contain touch-pan-y">
      {/* Background glow styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 pointer-events-none" />

      <div className="w-full max-w-sm sm:max-w-md relative z-10 space-y-4 my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center p-2 bg-slate-900/90 rounded-full border border-amber-500/30 shadow-xl mb-1">
            <RaxonIcon className="w-14 h-14 rounded-full shadow-md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span className="text-emerald-400">RAXON</span>
            <span className="text-amber-400">SFA</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-xs mx-auto">
            Sales Force Automation
          </p>
        </div>

        {/* Quick Biometric Login Card (If Enrolled or Available) */}
        {biometricStatus?.isAvailable && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
              {isFaceId ? <ScanFace className="w-24 h-24 text-indigo-400" /> : <Fingerprint className="w-24 h-24 text-indigo-400" />}
            </div>

            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
                  {isFaceId ? (
                    <ScanFace className={`w-6 h-6 ${isBiometricAuthenticating ? 'animate-pulse text-emerald-400' : ''}`} />
                  ) : (
                    <Fingerprint className={`w-6 h-6 ${isBiometricAuthenticating ? 'animate-pulse text-emerald-400' : ''}`} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white">
                      {isFaceId ? 'Face ID Unlock' : 'Biometric Fingerprint'}
                    </h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-4xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      SECURE
                    </span>
                  </div>
                  <p className="text-3xs text-slate-400">
                    {biometricStatus.hasEnrolledUser
                      ? `Welcome back, ${biometricStatus.enrolledUserName || 'Field Officer'}`
                      : 'Fast 1-tap mobile hardware authentication'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBiometricUnlock}
                disabled={isBiometricAuthenticating}
                className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 text-xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isBiometricAuthenticating ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    {isFaceId ? <ScanFace className="w-3.5 h-3.5" /> : <Fingerprint className="w-3.5 h-3.5" />}
                    <span>Unlock</span>
                  </>
                )}
              </button>
            </div>

            {biometricSuccessMessage && (
              <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-3xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{biometricSuccessMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Error Message banner */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Manual Mobile Number or Email Input */}
            <div>
              <label className="block text-3xs sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Mobile Number or Email ID</span>
                <span className="text-4xs text-emerald-400 font-normal lowercase font-mono">mobile or email</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder="e.g. 9876543212 or rk.tiwari@raxon.com"
                  required
                  autoFocus
                  className="w-full p-3.5 pl-10 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark-login-input transition-all placeholder:text-slate-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Manual Password Input */}
            <div>
              <label className="block text-3xs sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Password"
                  className="w-full p-3.5 pl-10 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark-login-input transition-all placeholder:text-slate-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-0.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none text-3xs sm:text-xs">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950" 
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-3xs text-slate-500 font-mono">v1.0 Secure Auth</span>
              </div>

              {/* Biometric Enable Toggle */}
              {biometricStatus?.isAvailable && (
                <label className="flex items-center gap-2 cursor-pointer select-none text-3xs sm:text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 px-2.5 py-1.5 rounded-lg hover:bg-indigo-950/60 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={enableBiometrics} 
                    onChange={(e) => setEnableBiometrics(e.target.checked)} 
                    className="rounded border-indigo-700 text-indigo-500 focus:ring-indigo-400 bg-slate-950" 
                  />
                  <div className="flex items-center gap-1.5">
                    {isFaceId ? <ScanFace className="w-3.5 h-3.5 text-indigo-400" /> : <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>Enable {isFaceId ? 'Face ID' : 'Fingerprint'} for next login</span>
                  </div>
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm mt-2 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Field Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Footer Note */}
        <div className="text-center space-y-1 text-3xs text-slate-500 font-semibold px-2">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Biometric Hardware Security & Geolocation Validation</span>
          </p>
          <p className="flex items-center justify-center gap-1">
            <Smartphone className="w-3 h-3 text-slate-600" />
            <span>Capacitor Native Biometric Auth Enabled</span>
          </p>
        </div>
      </div>
    </div>
  );
}
