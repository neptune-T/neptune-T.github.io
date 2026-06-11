export const SITE_URL = 'https://neptune-t.github.io';
export const SITE_NAME = 'Tianshan Zhang';
export const GITHUB_URL = 'https://github.com/neptune-T';

export const toCanonicalUrl = (path: string) => {
  const cleanPath = path.split(/[?#]/)[0] || '/';
  const canonicalPath = cleanPath === '/' ? '/' : `${cleanPath.replace(/\/+$/, '')}/`;
  return `${SITE_URL}${canonicalPath}`;
};

export const toAbsoluteUrl = (path: string) => {
  const absolutePath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${absolutePath}`;
};
