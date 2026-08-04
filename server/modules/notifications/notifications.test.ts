import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as notificationsService from './notifications.service.js';

describe('Notifications Service', () => {
  it('should export broadcast function', () => {
    assert.strictEqual(typeof notificationsService.broadcast, 'function');
  });
});
