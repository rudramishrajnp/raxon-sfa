import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jrenwqacdknuckdjqeiy.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZW53cWFjZGtudWNrZGpxZWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDk3NDIsImV4cCI6MjEwMjcyNTc0Mn0.WqRVfal0btBabXHGvqrzNefyKI35zpjgphXwbHZqKhQ';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side Supabase client (using service_role key when provided, otherwise anonymous key)
const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Role normalization helper for server-side RBAC
function normalizeServerRole(role?: string): 'SUPER_ADMIN' | 'ADMIN' | 'ZM' | 'RM' | 'AM' | 'MR' {
  if (!role) return 'MR';
  const r = role.toString().trim();
  const rLower = r.toLowerCase();
  if (rLower.includes('super admin') || rLower.includes('super_admin') || rLower === 'super_admin') return 'SUPER_ADMIN';
  if (rLower.includes('admin') || rLower.includes('company_admin') || rLower.includes('cadm') || r === 'ADMIN') return 'ADMIN';
  if (rLower.includes('division system admin') || rLower.includes('division admin') || rLower.includes('zm') || rLower.includes('zone manager')) return 'ZM';
  if (rLower.includes('rm') || rLower.includes('regional manager')) return 'RM';
  if (rLower.includes('am') || rLower.includes('area manager')) return 'AM';
  return 'MR';
}

// In-memory rate limiter for sensitive unauthenticated endpoints
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string, maxRequests: number = 15, windowMs: number = 60000): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= maxRequests) {
    return false;
  }
  bucket.count++;
  return true;
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitBuckets.entries()) {
    if (now > val.resetAt) rateLimitBuckets.delete(key);
  }
}, 300000);

// Zero-Trust Authentication Middleware: Validates caller's Supabase JWT
async function authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Missing or malformed Bearer token.' });
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Missing token value.' });
    }

    // Authoritative verification via Supabase Auth API
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Invalid, revoked, or expired authentication token.' });
    }

    const authUser = authData.user;
    const authUid = authUser.id;
    const authEmail = (authUser.email || '').toLowerCase();

    // Query authoritative caller profile from database
    const { data: callerProfile, error: profileErr } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .or(`id.eq.${authUid},email.ilike.${authEmail}`)
      .maybeSingle();

    const normalizedRole = normalizeServerRole(callerProfile?.role || authUser.user_metadata?.role);
    const callerStatus = callerProfile?.status || 'Active';

    if (callerStatus !== 'Active') {
      return res.status(403).json({ error: 'Caller user account is inactive or suspended.' });
    }

    // Attach verified identity & authoritative profile to request context
    (req as any).authenticatedUser = authUser;
    (req as any).userProfile = callerProfile || {
      id: authUid,
      email: authEmail,
      role: normalizedRole,
      company_id: callerProfile?.company_id || authUser.user_metadata?.company_id || '',
      status: 'Active'
    };
    (req as any).userRole = normalizedRole;

    return next();
  } catch (err: any) {
    console.error('[Zero-Trust Auth Middleware Error]:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}

// Role Authorization Middleware Generator
function requireRoles(allowedRoles: Array<'SUPER_ADMIN' | 'ADMIN' | 'ZM' | 'RM' | 'AM' | 'MR'>) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const callerRole = (req as any).userRole as 'SUPER_ADMIN' | 'ADMIN' | 'ZM' | 'RM' | 'AM' | 'MR';
    if (!callerRole || !allowedRoles.includes(callerRole)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient administrative privileges.'
      });
    }
    return next();
  };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // =========================================================================
  // 1. SECURE SERVER-SIDE USER CREATION & PROVISIONING
  // =========================================================================
  app.post('/api/auth/admin-create-user', authenticateUser, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
    try {
      const callerRole = (req as any).userRole;
      const callerProfile = (req as any).userProfile;

      const {
        email,
        password,
        name,
        phone,
        companyId,
        companyName,
        role,
        roleTitle,
        divisionId,
        divisionName
      } = req.body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email address is required.' });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'User name is required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const targetRole = role || 'ADMIN';
      const normalizedTargetRole = normalizeServerRole(targetRole);

      // SECURITY RULE 1: Non-SUPER_ADMIN callers CANNOT create SUPER_ADMIN accounts
      if (callerRole !== 'SUPER_ADMIN' && normalizedTargetRole === 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Access denied: Only Platform Super Admins can create Super Admin accounts.' });
      }

      // SECURITY RULE 2: Non-SUPER_ADMIN callers are strictly bounded to their own companyId
      let effectiveCompanyId = companyId;
      if (callerRole !== 'SUPER_ADMIN') {
        effectiveCompanyId = callerProfile.company_id || callerProfile.companyId;
        if (!effectiveCompanyId) {
          return res.status(403).json({ error: 'Access denied: Administrator is not bound to a valid company tenant.' });
        }
      } else if (!effectiveCompanyId && normalizedTargetRole !== 'SUPER_ADMIN') {
        return res.status(400).json({ error: 'Company ID is required for company user accounts.' });
      }

      let authUid = '';

      // Create or update user via Supabase Auth Admin API if service_role key is available
      if (SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
          const existing = listData?.users?.find((u: any) => u.email?.toLowerCase() === cleanEmail);

          if (existing) {
            authUid = existing.id;
            await supabaseAdmin.auth.admin.updateUserById(authUid, {
              password: password,
              email_confirm: true,
              user_metadata: {
                name: name.trim(),
                role: targetRole,
                company_id: effectiveCompanyId || ''
              }
            });
          } else {
            const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
              email: cleanEmail,
              password: password,
              email_confirm: true,
              user_metadata: {
                name: name.trim(),
                role: targetRole,
                company_id: effectiveCompanyId || ''
              }
            });

            if (createErr) {
              console.error('Supabase admin.createUser error:', createErr);
              return res.status(400).json({ error: `Auth user creation failed: ${createErr.message}` });
            }
            authUid = createData.user.id;
          }
        } catch (adminApiErr: any) {
          console.error('Supabase Admin API call error:', adminApiErr);
          return res.status(500).json({ error: `Admin Auth API failure: ${adminApiErr.message || adminApiErr}` });
        }
      } else {
        // Fallback: Use standard Supabase Auth signUp endpoint
        const { data: signUpData, error: signUpErr } = await supabaseAdmin.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              name: name.trim(),
              role: targetRole,
              company_id: effectiveCompanyId || ''
            }
          }
        });

        if (signUpErr && !signUpErr.message?.toLowerCase().includes('already registered')) {
          console.error('Supabase signUp error:', signUpErr);
          return res.status(400).json({ error: `Auth registration failed: ${signUpErr.message}` });
        }

        if (signUpData?.user?.id) {
          authUid = signUpData.user.id;
        } else {
          const { data: existingProfiles } = await supabaseAdmin.from('user_profiles').select('id').eq('email', cleanEmail).maybeSingle();
          authUid = existingProfiles?.id || `CADM-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`;
        }
      }

      // Construct canonical UserProfile JSONB without password
      const initials = name.trim().split(' ').filter(Boolean).map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'CA';
      const profileData = {
        id: authUid,
        name: name.trim(),
        email: cleanEmail,
        phone: phone || '',
        role: targetRole,
        roleTitle: roleTitle || (normalizedTargetRole === 'SUPER_ADMIN' ? 'Platform Super Admin' : 'Company Admin'),
        companyId: effectiveCompanyId || '',
        companyName: companyName || '',
        divisionId: divisionId || '',
        divisionName: divisionName || '',
        hq: `${companyName || 'Corporate'} Office`,
        territory: 'National / All Divisions Field Network',
        initials,
        avatarBg: 'bg-purple-900',
        status: 'Active',
        metrics: {},
        createdAt: new Date().toISOString()
      };

      // Upsert into public.user_profiles (STRICTLY NO PLAINTEXT PASSWORD IN DB)
      const { error: profileUpsertErr } = await supabaseAdmin.from('user_profiles').upsert({
        id: authUid,
        company_id: effectiveCompanyId || '',
        division_id: divisionId || '',
        role: targetRole,
        email: cleanEmail,
        name: name.trim(),
        phone: phone || '',
        status: 'Active',
        data: profileData,
        updated_at: new Date().toISOString()
      });

      if (profileUpsertErr) {
        console.warn('user_profiles upsert notice:', profileUpsertErr.message);
      }

      return res.json({
        status: 'success',
        user: {
          id: authUid,
          email: cleanEmail,
          name: name.trim(),
          role: targetRole,
          companyId: effectiveCompanyId || '',
          status: 'Active'
        }
      });
    } catch (err: any) {
      console.error('Server admin-create-user exception:', err);
      return res.status(500).json({ error: 'Internal server error during user creation.' });
    }
  });

  // =========================================================================
  // 2. SECURE EMAIL LOOKUP (FOR MOBILE NUMBER / EMPLOYEE ID LOGIN)
  // =========================================================================
  app.post('/api/auth/lookup-email', async (req, res) => {
    try {
      const clientIp = req.ip || req.headers['x-forwarded-for'] || 'anonymous';
      if (!checkRateLimit(`lookup_${clientIp}`, 20, 60000)) {
        return res.status(429).json({ error: 'Too many lookup requests. Please try again in one minute.' });
      }

      const { identifier } = req.body;
      if (!identifier || typeof identifier !== 'string' || identifier.trim().length < 3) {
        return res.status(400).json({ error: 'Valid identifier is required' });
      }

      const clean = identifier.trim().toLowerCase();
      const cleanDigits = clean.replace(/[^0-9]/g, '');

      // Direct query on user_profiles for matching identifier
      const { data: profiles, error } = await supabaseAdmin.from('user_profiles').select('id, email, phone, data');
      if (!error && profiles) {
        const match = profiles.find((p: any) => {
          if (p.email?.toLowerCase() === clean) return true;
          if (p.id?.toLowerCase() === clean) return true;
          if (p.phone && p.phone.replace(/[^0-9]/g, '') === cleanDigits && cleanDigits.length >= 7) return true;
          const pData = p.data || {};
          if (pData.phone && pData.phone.replace(/[^0-9]/g, '') === cleanDigits && cleanDigits.length >= 7) return true;
          return false;
        });

        if (match && match.email) {
          return res.json({ found: true, email: match.email });
        }
      }

      return res.json({ found: false, error: 'No matching user found for this identifier.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Error processing lookup request.' });
    }
  });

  // =========================================================================
  // 3. SAFE RECONCILIATION FOR EXISTING COMPANY ADMINS (SUPER_ADMIN ONLY)
  // =========================================================================
  app.post('/api/auth/reconcile-company-admins', authenticateUser, requireRoles(['SUPER_ADMIN']), async (req, res) => {
    try {
      const { data: companies } = await supabaseAdmin.from('companies').select('*');
      const { data: profiles } = await supabaseAdmin.from('user_profiles').select('*');
      
      let reconciledCount = 0;
      const details: any[] = [];

      if (companies && Array.isArray(companies)) {
        for (const compRow of companies) {
          const compData = compRow.data || compRow;
          if (Array.isArray(compData.companyAdmins)) {
            for (const admin of compData.companyAdmins) {
              if (admin.email && admin.email.includes('@')) {
                const cleanEmail = admin.email.trim().toLowerCase();
                const existingProfile = profiles?.find((p: any) => p.email?.toLowerCase() === cleanEmail);
                const targetId = existingProfile?.id || admin.id || `CADM-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`;

                const sanitizedAdminProfile = {
                  id: targetId,
                  name: admin.name || 'Company Admin',
                  email: cleanEmail,
                  phone: admin.phone || '',
                  role: 'ADMIN',
                  roleTitle: 'Company Admin',
                  companyId: compRow.id,
                  companyName: compRow.name || compData.name || '',
                  hq: `${compRow.name || compData.name || 'Company'} Corporate Office`,
                  territory: 'National / All Divisions Field Network',
                  initials: (admin.name || 'CA').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase(),
                  avatarBg: 'bg-purple-900',
                  status: admin.status || 'Active',
                  metrics: {},
                  createdAt: admin.createdAt || new Date().toISOString()
                };

                await supabaseAdmin.from('user_profiles').upsert({
                  id: targetId,
                  company_id: compRow.id,
                  role: 'ADMIN',
                  email: cleanEmail,
                  name: admin.name || 'Company Admin',
                  phone: admin.phone || '',
                  status: 'Active',
                  data: sanitizedAdminProfile,
                  updated_at: new Date().toISOString()
                });

                reconciledCount++;
                details.push({ companyId: compRow.id, email: cleanEmail, profileId: targetId });
              }
            }
          }
        }
      }

      return res.json({
        status: 'success',
        reconciledCount,
        details
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Internal server error during reconciliation.' });
    }
  });

  // =========================================================================
  // 4. SECURE CREDENTIALS DISPATCH (ADMIN / SUPER_ADMIN ONLY)
  // =========================================================================
  app.post('/api/email/send-credentials', authenticateUser, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
    const callerRole = (req as any).userRole;
    const callerProfile = (req as any).userProfile;

    const { email, name, password, companyName, companyId, role, subscriptionDetails } = req.body;

    if (!email || !name || !password || !companyName || !companyId || !role) {
      return res.status(400).json({ 
        error: 'Missing required parameters (email, name, password, companyName, companyId, role are all required)' 
      });
    }

    // Enforce company boundary for non-SUPER_ADMIN
    if (callerRole !== 'SUPER_ADMIN' && callerProfile.company_id && callerProfile.company_id !== companyId) {
      return res.status(403).json({ error: 'Access denied: Cannot dispatch credentials for another company tenant.' });
    }

    const appUrl = process.env.APP_URL || 'https://raxonsfa.ai.studio';
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const rawPass = process.env.SMTP_PASS;
    const smtpPass = rawPass ? rawPass.replace(/\s+/g, '') : undefined;
    
    let smtpFrom = process.env.SMTP_FROM || smtpUser || 'Raxon SFA <no-reply@raxon.com>';
    if (smtpFrom && !smtpFrom.includes('@') && smtpUser) {
      smtpFrom = `"${smtpFrom}" <${smtpUser}>`;
    }

    let subscriptionHtml = '';
    if (subscriptionDetails) {
      const { planTier, validUntil, mrQuota, managerQuota } = subscriptionDetails;
      subscriptionHtml = `
        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 16px; margin: 20px 0; background-color: #f8fafc;">
          <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 15px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Subscription Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #64748b; width: 45%;">Plan Tier:</td>
              <td style="padding: 4px 0; font-weight: bold; color: #10b981;">${planTier || 'Enterprise'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #64748b;">Valid Until:</td>
              <td style="padding: 4px 0; color: #334155;">${validUntil || 'Lifetime'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #64748b;">MR Quota Limit:</td>
              <td style="padding: 4px 0; color: #334155;">${mrQuota || 'Unlimited'} reps</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #64748b;">Manager Quota Limit:</td>
              <td style="padding: 4px 0; color: #334155;">${managerQuota || 'Unlimited'} managers</td>
            </tr>
          </table>
        </div>
      `;
    }

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; border: 1px solid #e1e8ed; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #4F46E5; color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">RAXON SFA</h2>
          <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Sales Force Automation & CRM</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="font-size: 16px; margin-top: 0; color: #0f172a;">Hello <strong>${name}</strong>,</p>
          <p style="color: #334155;">Welcome to <strong>${companyName}</strong> on the Raxon SFA platform. Your user account has been successfully configured. Here are your login credentials to access the system:</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #475569; width: 35%;">Login Email / ID:</td>
                <td style="padding: 6px 0; font-family: monospace; font-size: 15px; color: #0f172a; word-break: break-all;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #475569;">Password:</td>
                <td style="padding: 6px 0; font-family: monospace; font-size: 15px; color: #4F46E5; font-weight: bold;">${password}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #475569;">Assigned Role:</td>
                <td style="padding: 6px 0; color: #0f172a;"><span style="background-color: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${role}</span></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #475569;">Company ID:</td>
                <td style="padding: 6px 0; font-family: monospace; font-size: 14px; color: #0f172a;">${companyId}</td>
              </tr>
            </table>
          </div>

          ${subscriptionHtml}

          <div style="text-align: center; margin: 30px 0 20px 0;">
            <a href="${appUrl}" target="_blank" style="background-color: #4F46E5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);">Login to Raxon SFA</a>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <strong>Important:</strong> For security reasons, please change your password immediately after your first login. Do not share your login credentials with anyone.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          &copy; 2026 Raxon Healthcare Technologies. All rights reserved.
        </div>
      </div>
    `;

    // 1. Resend API Integration
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const fromAddress = process.env.RESEND_FROM || process.env.SMTP_FROM || 'RAXON SFA <onboarding@resend.dev>';
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            subject: `Welcome to ${companyName} - Raxon SFA Login Credentials`,
            html: emailHtml
          })
        });

        const resendData = (await resendResponse.json()) as { id?: string; error?: any };
        if (resendResponse.ok) {
          return res.json({
            status: 'success',
            channel: 'SERVER_RESEND',
            message: `Welcome credentials email sent to ${email} via Resend. (ID: ${resendData.id})`,
            simulated: false,
            recipient: email
          });
        }
      } catch (resendErr: any) {
        console.error('Resend API call error:', resendErr.message || resendErr);
      }
    }

    // 2. SendGrid API Integration
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    if (sendGridApiKey) {
      try {
        const fromAddress = process.env.SENDGRID_FROM || process.env.SMTP_FROM || 'admin@raxon.cloud';
        const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendGridApiKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email }] }],
            from: { email: fromAddress.includes('<') ? fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress : fromAddress, name: 'RAXON SFA' },
            subject: `Welcome to ${companyName} - Raxon SFA Login Credentials`,
            content: [{ type: 'text/html', value: emailHtml }]
          })
        });

        if (sendgridResponse.ok || sendgridResponse.status === 202) {
          return res.json({
            status: 'success',
            channel: 'SERVER_SENDGRID',
            message: `Welcome credentials email sent to ${email} via SendGrid.`,
            simulated: false,
            recipient: email
          });
        }
      } catch (sgErr: any) {
        console.error('SendGrid API call error:', sgErr.message || sgErr);
      }
    }

    // 3. If SMTP variables are set, attempt real SMTP delivery
    if (smtpHost && smtpUser && smtpPass) {
      try {
        let transportOptions: any = {
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          connectionTimeout: 3000,
          greetingTimeout: 3000,
          socketTimeout: 3000,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          }
        };

        if (smtpHost.toLowerCase().includes('gmail')) {
          transportOptions = {
            service: 'gmail',
            connectionTimeout: 3000,
            greetingTimeout: 3000,
            socketTimeout: 3000,
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          };
        }

        const transporter = nodemailer.createTransport(transportOptions);

        const info = await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject: `Welcome to ${companyName} - Raxon SFA Login Credentials`,
          html: emailHtml,
        });

        return res.json({
          status: 'success',
          message: `Welcome email sent successfully via SMTP. MessageId: ${info.messageId}`,
          simulated: false,
          recipient: email
        });
      } catch (smtpError: any) {
        return res.json({
          status: 'fallback',
          message: `Real SMTP sending failed (${smtpError.message || smtpError}), email simulated.`,
          simulated: true,
          recipient: email,
          simulatedBody: emailHtml
        });
      }
    } else {
      return res.json({
        status: 'success',
        message: 'Email dispatch simulated successfully. Configure SMTP credentials in Secrets Settings to send real emails.',
        simulated: true,
        recipient: email,
        simulatedBody: emailHtml
      });
    }
  });

  // API System Health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      system: 'RAXON SFA Server',
      timestamp: new Date().toISOString()
    });
  });

  // Check if running with Vite dev server or static production
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite middleware fallback to static:", e);
      serveStatic(app);
    }
  } else {
    serveStatic(app);
  }

  function serveStatic(expressApp: express.Express) {
    const distPath = path.resolve(process.cwd(), 'dist');
    expressApp.use(express.static(distPath));
    expressApp.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send(`<!DOCTYPE html><html><head><title>RAXON SFA</title></head><body><h2>Loading RAXON SFA...</h2><script>location.reload();</script></body></html>`);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RAXON SFA Server running on port ${PORT}`);
  });
}

startServer();

