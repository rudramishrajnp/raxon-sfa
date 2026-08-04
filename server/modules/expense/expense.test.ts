import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as expenseService from './expense.service.js';

describe('Expense Service', () => {
  it('should export submitExpense function', () => {
    assert.strictEqual(typeof expenseService.submitExpense, 'function');
  });

  it('should export reviewExpense function', () => {
    assert.strictEqual(typeof expenseService.reviewExpense, 'function');
  });
});
