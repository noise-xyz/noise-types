# Installation

This package is only available to members of the noise-xyz organization.

1. Create or edit `~/.npmrc` in your home directory:

```
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
@noise-xyz:registry=https://npm.pkg.github.com
```

2. Create a GitHub Personal Access Token:

    - Go to GitHub Settings → Developer Settings → Personal Access Token → Fine-grained tokens
    - Create a new token with these permissions:
        - Repository access: Select your org's repositories
        - Permissions:
            - Packages: Read
    - Copy the token and replace `YOUR_GITHUB_TOKEN` in your `.npmrc` with it

3. Install the package:

```bash
npm install @noise-xyz/noise-types
```

## Troubleshooting

If you get a 404 error when installing:

1. Ensure you're a member of the noise-xyz organization
2. Check that your `.npmrc` is correctly set up
3. Verify your GitHub token has the correct permissions
4. Try logging out and back in to npm: `npm logout && npm login`
