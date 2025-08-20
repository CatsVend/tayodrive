// pages/_utils_baseurl.js  (작은 헬퍼)
export function getBaseUrl(req) {
  const proto = req?.headers?.['x-forwarded-proto'] || 'http';
  const host = req?.headers?.host || 'localhost:3000';
  return `${proto}://${host}`;
}
