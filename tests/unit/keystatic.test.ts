import { createReader } from '@keystatic/core/reader';
import { describe, expect, it } from 'vitest';
import keystaticConfig from '../../keystatic.config';

// Proves the editor schema matches the files the site reads, so edits made in
// the admin never break the build.
const reader = createReader(process.cwd(), keystaticConfig);

describe('keystatic schema', () => {
  it('reads every singleton', async () => {
    expect((await reader.singletons.site.readOrThrow()).name).toBeTruthy();
    expect((await reader.singletons.home.readOrThrow()).heroHeadline).toBeTruthy();
    expect((await reader.singletons.about.readOrThrow()).paragraphs.length).toBeGreaterThan(0);
  });

  it('reads every collection entry', async () => {
    for (const key of ['services', 'industries', 'posts', 'landing'] as const) {
      const entries = await reader.collections[key].all();
      expect(entries.length, key).toBeGreaterThan(0);
    }
  });
});
