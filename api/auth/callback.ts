import { serialize } from 'cookie';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // 1. Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: 'Failed to obtain access token' });
    }

    // 2. Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    const userData = await userResponse.json();
    const username = userData.login;

    // 3. Check organization membership
    const allowedOrg = process.env.ADMIN_ALLOWED_ORG || 'Yakoub-ai';
    const orgResponse = await fetch(`https://api.github.com/orgs/${allowedOrg}/members/${username}`, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    if (orgResponse.status !== 204) {
      return res.status(403).json({ error: `Access denied: Not a member of ${allowedOrg}` });
    }

    // 4. Set cookie (Simple implementation, in production use JWT/Iron-session)
    const cookie = serialize('gh_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    res.setHeader('Set-Cookie', cookie);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
