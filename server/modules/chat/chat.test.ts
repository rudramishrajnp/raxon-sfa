import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as chatService from './chat.service.js';

describe('Chat Service', () => {
  it('should export getMyGroups function', () => {
    assert.strictEqual(typeof chatService.getMyGroups, 'function');
  });
  
  it('should export sendMessage function', () => {
    assert.strictEqual(typeof chatService.sendMessage, 'function');
  });
});
