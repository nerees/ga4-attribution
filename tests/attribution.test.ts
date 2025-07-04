import { describe, it, expect } from 'vitest';
import { storeGA4AttributionData, getGA4AttributionData, clearGA4AttributionData } from '../src';

describe('GA4 Attribution', () => {
  it('should return empty if nothing is stored', () => {
    clearGA4AttributionData();
    const data = getGA4AttributionData();
    expect(Object.keys(data).length).toBe(0);
  });

  it('should persist attribution data', () => {
    const data = storeGA4AttributionData();
    expect(data.client_id).toBeDefined();
  });
});