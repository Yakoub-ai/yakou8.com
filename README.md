# yakou8.com

### 🔐 Admin Portal (CMS)
The website includes a secure admin portal at `/admin` that allows you to manage projects without touching the code.

#### Setup Requirements (Vercel)
To enable the admin portal, you must set the following **Environment Variables** in Vercel:
- `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID.
- `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret.
- `GITHUB_REDIRECT_URI`: `https://yakou8.com/api/auth/callback`
- `ADMIN_ALLOWED_ORG`: `Yakoub-ai` (The organization members allowed to log in).
- `REPO_NAME`: `yakou8.com` (The name of this repository).

### Updating Branding & Text
- **Hero Section**: Edit the text inside the `motion.div` in the `Hero` section of [Index.tsx](src/pages/Index.tsx).
- **About Section**: Update the team description in the `About` section.
- **Contact**: The "Contact Us" button links to `mailto:georgeyakoub@gmail.com`.

## Deployment
The website is configured for hosting on **Vercel**. Every push to the `main` branch will trigger an automatic deployment.
