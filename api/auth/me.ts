import { parse } from 'cookie';

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.gh_token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!userResponse.ok) {
      return res.status(401).json({ authenticated: false });
    }

    const userData = await userResponse.json();
    res.status(200).json({ 
      authenticated: true, 
      user: {
        login: userData.login,
        avatar_url: userData.avatar_url,
        name: userData.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
