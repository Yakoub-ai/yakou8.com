import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.gh_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { projects } = req.body;

  if (!projects || !Array.isArray(projects)) {
    return res.status(400).json({ error: 'Invalid projects data' });
  }

  try {
    const owner = process.env.ADMIN_ALLOWED_ORG || 'Yakoub-ai';
    const repo = process.env.REPO_NAME || 'yakou8.com';
    const path = 'public/projects.json';

    // 1. Get the current file SHA
    const getFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!getFileResponse.ok) {
      throw new Error('Failed to fetch current file from GitHub');
    }

    const fileData = await getFileResponse.json();
    const sha = fileData.sha;

    // 2. Update the file
    const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update projects via Admin CMS',
        content: Buffer.from(JSON.stringify(projects, null, 2)).toString('base64'),
        sha,
        branch: 'main',
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.message || 'Failed to update file on GitHub');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
