import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('PageClassificationTierAccordion', () => {
  it('renders tiers as closed accordion items without defaultExpanded', () => {
    const source = readFileSync(
      join(process.cwd(), 'components/results/PageClassificationTierAccordion.tsx'),
      'utf8',
    );
    expect(source).toContain('MsqdxAccordion');
    expect(source).toContain('MsqdxAccordionItem');
    expect(source).not.toContain('defaultExpanded');
    expect(source).toContain('page-classification-tier-');
  });
});
