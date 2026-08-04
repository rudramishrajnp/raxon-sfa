import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as salesService from './sales.service.js';

describe('Secondary Sales Service', () => {
  it('should export addSecondarySales function', () => {
    assert.strictEqual(typeof salesService.addSecondarySales, 'function');
  });
});
