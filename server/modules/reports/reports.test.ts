import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as reportsService from './reports.service.js';

describe('Reports Service', () => {
  it('should export getDailyDCRReport function', () => {
    assert.strictEqual(typeof reportsService.getDailyDCRReport, 'function');
  });
});
