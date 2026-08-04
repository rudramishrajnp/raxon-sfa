import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as dashboardService from './dashboard.service.js';

describe('Dashboard Service', () => {
  it('should export getExecutiveDashboard function', () => {
    assert.strictEqual(typeof dashboardService.getExecutiveDashboard, 'function');
  });
});
