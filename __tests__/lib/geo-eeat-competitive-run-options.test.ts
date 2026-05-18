import { describe, expect, it } from 'vitest';
import {
  buildCompetitiveRunOptions,
  competitiveRunIndexFromSelection,
} from '@/lib/geo-eeat/competitive-run-options';

describe('competitive-run-options', () => {
  it('builds current + history options', () => {
    const options = buildCompetitiveRunOptions('Current', [{ id: 'run-a', started_at: '2026-05-18T10:00:00Z' }], () => '18.05.2026');
    expect(options).toHaveLength(2);
    expect(options[0]).toEqual({ value: 0, label: 'Current', runId: null });
    expect(options[1]?.runId).toBe('run-a');
  });

  it('maps selected run id to tab index', () => {
    const history = [{ id: 'a' }, { id: 'b' }];
    expect(competitiveRunIndexFromSelection(null, history)).toBe(0);
    expect(competitiveRunIndexFromSelection('b', history)).toBe(2);
    expect(competitiveRunIndexFromSelection('missing', history)).toBe(0);
  });
});
