export type GA4AttributionData = {
  client_id?: string;
  session_id?: string;
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  page_location?: string;
  page_referrer?: string;
};

function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=2592000`; // 30 days
}

export function getGA4AttributionData(): GA4AttributionData {
  const keys = [
    'client_id', 'session_id', 'gclid',
    'utm_source', 'utm_medium', 'utm_campaign',
    'utm_term', 'utm_content',
    'page_location', 'page_referrer'
  ];

  const data: GA4AttributionData = {};
  keys.forEach(key => {
    const val = getCookie('ga4_' + key);
    if (val) data[key as keyof GA4AttributionData] = decodeURIComponent(val);
  });

  return data;
}

export function storeGA4AttributionData(): GA4AttributionData {
  const data: GA4AttributionData = {
    client_id: getCookie('_ga')?.split('.').slice(2).join('.') ?? undefined,
    session_id: getCookie('_ga_SESSION') ?? undefined,
    gclid: new URLSearchParams(location.search).get('gclid') ?? undefined,
    utm_source: new URLSearchParams(location.search).get('utm_source') ?? undefined,
    utm_medium: new URLSearchParams(location.search).get('utm_medium') ?? undefined,
    utm_campaign: new URLSearchParams(location.search).get('utm_campaign') ?? undefined,
    utm_term: new URLSearchParams(location.search).get('utm_term') ?? undefined,
    utm_content: new URLSearchParams(location.search).get('utm_content') ?? undefined,
    page_location: location.href,
    page_referrer: document.referrer
  };

  for (const [key, val] of Object.entries(data)) {
    if (val) setCookie('ga4_' + key, encodeURIComponent(val));
  }

  return data;
}

export function clearGA4AttributionData() {
  const keys = [
    'client_id', 'session_id', 'gclid',
    'utm_source', 'utm_medium', 'utm_campaign',
    'utm_term', 'utm_content',
    'page_location', 'page_referrer'
  ];
  keys.forEach(key => {
    document.cookie = `ga4_${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  });
}