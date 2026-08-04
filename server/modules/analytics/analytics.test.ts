import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as analyticsService from './analytics.service.js';

describe('Analytics Service', () => {
  it('should export getDailyKPIs function', () => {
    assert.strictEqual(typeof analyticsService.getDailyKPIs, 'function');
  });
});
