# @noise-xyz/noise-types

Type definitions for the Noise project.

## Installation

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

## Usage

Import types from their respective modules:

```typescript
import { Trade } from "@noise-xyz/noise-types/trading";
import { Position } from "@noise-xyz/noise-types/positions";
import { ActivityEvent } from "@noise-xyz/noise-types/events";
```

## Releasing New Versions

For maintainers: follow these steps to release a new version.

1. Ensure your local repo is up to date:

```bash
git checkout main
git pull origin main
```

2. Make sure you're authenticated with GitHub Packages:

```bash
# Set your GitHub token
export GITHUB_TOKEN=YOUR_GITHUB_TOKEN

# Verify authentication
npm whoami --registry=https://npm.pkg.github.com
```

3. Choose the appropriate version increment based on your changes:

    - `patch` for backwards-compatible bug fixes (1.0.0 -> 1.0.1)
    - `minor` for new backwards-compatible functionality (1.0.0 -> 1.1.0)
    - `major` for breaking changes (1.0.0 -> 2.0.0)

4. Release the new version:

```bash
# This will:
# 1. Build the package
# 2. Create and push a new git tag
# 3. Publish to GitHub Packages
npm version patch # or minor or major
npm publish
```

5. Verify the release:
    - Check the Packages section in GitHub
    - Check the Releases section for the new tag
    - Try installing the new version in a test project

## Troubleshooting

If you get a 404 error when installing:

1. Ensure you're a member of the noise-xyz organization
2. Check that your `.npmrc` is correctly set up
3. Verify your GitHub token has the correct permissions
4. Try logging out and back in to npm: `npm logout && npm login`
