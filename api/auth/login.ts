export default function handler(req, res) {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_uri = process.env.GITHUB_REDIRECT_URI || '';
  const scope = 'read:org user:email';
  
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`;
  
  res.redirect(githubUrl);
}
