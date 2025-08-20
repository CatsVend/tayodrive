// lib/auth.js
export function getAdminToken() {
  return process.env.TAYO_ADMIN_TOKEN || 'tayo-admin-dev-token';
}

export function assertAdmin(req, res) {
  const auth = req.headers.authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const header = req.headers['x-admin-token'];
  const token = bearer || header || '';

  if (token !== getAdminToken()) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
