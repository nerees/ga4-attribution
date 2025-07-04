import { useEffect, useState } from 'react';
import { getGA4AttributionData, GA4AttributionData } from '../src';

export function useGA4Attribution(): GA4AttributionData {
  const [data, setData] = useState<GA4AttributionData>({});
  useEffect(() => {
    setData(getGA4AttributionData());
  }, []);
  return data;
}