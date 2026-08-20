import { UserProfile, getStoredUserProfiles } from '../data/userContext';

export interface BiometricStatus {
  isAvailable: boolean;
  biometryType: 'fingerprint' | 'face' | 'iris' | 'biometrics' | 'none';
  biometryTitle: string;
  hasEnrolledUser: boolean;
  enrolledUserId?: string;
  enrolledUserName?: string;
}

const BIOMETRIC_STORAGE_KEY = 'raxon_sfa_biometric_user';
const BIOMETRIC_PREF_KEY = 'raxon_sfa_biometric_enabled';

/**
 * Check if the device hardware supports Biometrics (Fingerprint / FaceID)
 * and if biometric authentication is available and enrolled.
 */
export async function checkBiometricHardware(): Promise<{ isAvailable: boolean; type: string; title: string }> {
  try {
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor && (window as any).Capacitor.isNativePlatform();
    if (isNative) {
      // Dynamic import to prevent web crash
      const mod = await import('@aparajita/capacitor-biometric-auth').catch(() => null);
      if (mod && mod.BiometricAuth) {
        const result = await mod.BiometricAuth.checkBiometry();
        if (result.isAvailable) {
          let title = 'Fingerprint / Face ID';
          const bType = String(result.biometryType || '');
          if (bType.includes('face')) {
            title = 'Face ID';
          } else if (bType.includes('touch') || bType.includes('finger')) {
            title = 'Fingerprint / Touch ID';
          } else {
            title = 'Biometrics';
          }
          return { isAvailable: true, type: bType, title };
        }
      }
    }
  } catch {
    // Biometric plugin check failed or not running in native app
  }

  return { isAvailable: false, type: 'none', title: 'Biometrics' };
}

/**
 * Get comprehensive biometric status including device hardware & enrolled user profile
 */
export async function getBiometricStatus(): Promise<BiometricStatus> {
  const hardware = await checkBiometricHardware();
  const savedUserId = getSavedBiometricUserId();
  let enrolledUser: UserProfile | undefined;

  if (savedUserId) {
    const profiles = getStoredUserProfiles();
    enrolledUser = profiles.find(p => p.id === savedUserId);
  }

  let biometryType: BiometricStatus['biometryType'] = 'none';
  if (hardware.isAvailable) {
    const t = String(hardware.type || '').toLowerCase();
    if (t.includes('face')) {
      biometryType = 'face';
    } else if (t.includes('touch') || t.includes('finger')) {
      biometryType = 'fingerprint';
    } else {
      biometryType = 'biometrics';
    }
  }

  return {
    isAvailable: hardware.isAvailable,
    biometryType,
    biometryTitle: hardware.title,
    hasEnrolledUser: !!enrolledUser,
    enrolledUserId: enrolledUser?.id,
    enrolledUserName: enrolledUser?.name
  };
}

/**
 * Execute biometric authentication challenge (Fingerprint / Face ID prompt)
 */
export async function authenticateWithBiometrics(
  reason = 'Scan your fingerprint or face to sign in to Raxon SFA'
): Promise<{ success: boolean; error?: string }> {
  try {
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor && (window as any).Capacitor.isNativePlatform();
    if (isNative) {
      const mod = await import('@aparajita/capacitor-biometric-auth').catch(() => null);
      if (mod && mod.BiometricAuth) {
        await mod.BiometricAuth.authenticate({
          reason,
          androidTitle: 'Biometric Authentication',
          androidSubtitle: 'Raxon SFA Secure Login',
          allowDeviceCredential: true,
          iosFallbackTitle: 'Use PIN / Password'
        });
        return { success: true };
      }
    }
  } catch (err: unknown) {
    const errObj = err as { code?: string; message?: string };
    if (errObj?.code === 'userCancel' || errObj?.message?.toLowerCase().includes('cancel')) {
      return { success: false, error: 'Authentication canceled by user.' };
    }
  }

  return { 
    success: false, 
    error: 'Biometric authentication is supported on mobile app builds. Please sign in with your User ID and Password.' 
  };
}

/**
 * Save user ID for biometric 1-tap sign in
 */
export function saveBiometricUser(userId: string): void {
  try {
    localStorage.setItem(BIOMETRIC_STORAGE_KEY, userId);
    localStorage.setItem(BIOMETRIC_PREF_KEY, 'true');
  } catch (e) {
    console.error('Failed to save biometric user', e);
  }
}

/**
 * Get saved user ID for biometric login
 */
export function getSavedBiometricUserId(): string | null {
  try {
    const enabled = localStorage.getItem(BIOMETRIC_PREF_KEY);
    if (enabled !== 'true') return null;
    return localStorage.getItem(BIOMETRIC_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Clear saved biometric user
 */
export function clearBiometricUser(): void {
  try {
    localStorage.removeItem(BIOMETRIC_STORAGE_KEY);
    localStorage.removeItem(BIOMETRIC_PREF_KEY);
  } catch {
    // Ignore
  }
}
