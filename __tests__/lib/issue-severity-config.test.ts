import { describe, expect, it } from 'vitest';
import { issueSeverityConfig } from '@/lib/issues/severity-config';

describe('issueSeverityConfig', () => {
  it('maps known severities and falls back to notice', () => {
    expect(issueSeverityConfig('error').label).toBe('Error');
    expect(issueSeverityConfig('unknown').label).toBe('Notice');
  });
});
