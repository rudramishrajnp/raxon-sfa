import { supabase } from '../supabaseClient';

/**
 * Test table write function for Supabase verification
 */
export async function executeTestTerritoryWrite(): Promise<{ success: boolean; data: any; message: string }> {
  try {
    const payload = {
      id: "test_territory_1",
      company_id: "JMK",
      data: {
        name: "Test HQ Territory",
        companyId: "JMK",
        createdAt: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    };

    console.log('[Supabase Test Write] Initiating write to sync_audit_logs...', payload);
    
    const { error: insertErr } = await supabase.from('sync_audit_logs').insert({
      action: 'TEST',
      action_type: 'VERIFICATION_WRITE',
      entity_type: 'territories',
      entity_id: 'test_territory_1',
      company_id: 'JMK',
      new_values: payload,
      timestamp: new Date().toISOString(),
      source: 'testSupabaseWrite'
    });
    
    if (insertErr) {
      throw insertErr;
    }

    console.log('✅ [Supabase Test Write SUCCESS] Record successfully written to Supabase!');
    
    return {
      success: true,
      data: payload,
      message: 'Supabase write succeeded and verified!'
    };
  } catch (error) {
    console.error('❌ [Supabase Test Write ERROR] Failed to write record:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

// Attach to window object for convenient manual execution from browser DevTools
if (typeof window !== 'undefined') {
  (window as any).runTestFirestoreWrite = executeTestTerritoryWrite;
  (window as any).runTestSupabaseWrite = executeTestTerritoryWrite;
}
