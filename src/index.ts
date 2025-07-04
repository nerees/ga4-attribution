export interface GA4AttributionData {
  client_id?: string;
  session_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  page_location?: string;
  page_referrer?: string;
}

const ATTR_KEYS: (keyof GA4AttributionData)[] = [
  'client_id', 'session_id', 'utm_source', 'utm_medium', 'utm_campaign',
  'utm_term', 'utm_content', 'gclid', 'page_location', 'page_referrer'
];

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number = 30): void {
  const d = new Date();
  d.setTime(d.getTime() + days * 864e5);
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${d.toUTCString()}`;
}

function getClientId(): string | undefined {
  const ga = getCookie('_ga');
  if (!ga) return undefined;
  const parts = ga.split('.');
  return parts.length === 4 ? `${parts[2]}.${parts[3]}` : undefined;
}

function getSessionId(): string | undefined {
  const keys = Object.keys(sessionStorage);
  const gaKey = keys.find(k => k.startsWith('ga_session'));
  return gaKey ? sessionStorage.getItem(gaKey) ?? undefined : undefined;
}

function getUrlParams(): Partial<GA4AttributionData> {
  const params: Partial<GA4AttributionData> = {};
  const searchParams = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'].forEach(key => {
    const val = searchParams.get(key);
    if (val) params[key as keyof GA4AttributionData] = val;
  });
  return params;
}

export function storeGA4AttributionData(): GA4AttributionData {
  const data: GA4AttributionData = {
    client_id: getClientId(),
    session_id: getSessionId(),
    page_location: window.location.href,
    page_referrer: document.referrer,
    ...getUrlParams()
  };

  for (const [key, value] of Object.entries(data)) {
    if (value) setCookie(`ga4_${key}`, value);
  }

  return data;
}

export function getGA4AttributionData(): GA4AttributionData {
  const data: GA4AttributionData = {};
  ATTR_KEYS.forEach((key) => {
    const val = getCookie(`ga4_${key}`);
    if (val) data[key] = val;
  });
  return data;
}

export function clearGA4AttributionData(): void {
  ATTR_KEYS.forEach((key) => setCookie(`ga4_${key}`, '', -1));
}

if (typeof window !== 'undefined') {
  storeGA4AttributionData();
}
