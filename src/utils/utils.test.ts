import { describe, it, expect } from 'vitest';

describe('Basic tests', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const appName = 'N-400 Prep Companion';
    expect(appName).toContain('N-400');
  });

  it('should handle array operations', () => {
    const items = ['passport', 'greencard', 'taxes'];
    expect(items).toHaveLength(3);
    expect(items).toContain('passport');
  });
});
