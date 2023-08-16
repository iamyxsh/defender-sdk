# Defender V2 SDK Packages

<!-- TODO: Confirm these are all populating with data -->

[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/OpenZeppelin/defender-sdk/badge)](https://api.securityscorecards.dev/projects/github.com/OpenZeppelin/defender-sdk)
[![OpenSSF Best Practices](https://bestpractices.coreinfrastructure.org/projects/7395/badge)](https://bestpractices.coreinfrastructure.org/projects/7395)
[![Scorecard supply-chain security](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/scorecard.yml/badge.svg)](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/scorecard.yml)
[![Stable Git Release](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/stable.yml/badge.svg)](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/stable.yml)
[![RC Git Release](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/rc.yml/badge.svg)](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/rc.yml)
[![CI](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/ci.yml)

This monorepo contains individual OpenZeppelin Defender TypeScript clients and publishes the collection of clients as `@openzeppelin/defender-sdk`

## Development Setup

- `pnpm` for workspaces & dependency management.
- `nx` for build & tests.
- `changesets` for versioning, changelog management & publishing.

- Checkout the repo and run `pnpm i --ignore-scripts --prefer-offline && pnpm run build`.

  > Install pnpm globally with `npm i -g pnpm` if you haven't already.

- To skip cache on the subsequent build steps you can use `pnpm nx-build-skip-cache`.

## Testing

- Run `pnpm nx-test-skip-cache` to run unit tests across all packages.

## Linting & Styling

- Run `pnpm lint:check` or `pnpm prettier:check` at the project root. For fixing `pnpm lint:fix`

## Combining style, build & test in single command

- Run `pnpm nx-build-test-skip-cache`.

## Publish

<!-- TODO: define publish steps re Github CI - this section could be deleted if we want to just document this internally -->

## Examples

The `examples` repo has sample code - note that most examples rely on `dotenv` for loading API keys and secrets.

## Lower Environments

You can set the following environment variables to control to which instance your client will connect to:

```bash
# all modules/clients besides relay signer
DEFENDER_API_URL=
DEFENDER_POOL_ID=
DEFENDER_POOL_CLIENT_ID=
# relay signer
DEFENDER_RELAY_SIGNER_API_URL=
DEFENDER_RELAY_SIGNER_POOL_ID=
DEFENDER_RELAY_SIGNER_POOL_CLIENT_ID=
```

---

### CI/CD

- For time being the manual process is as follows until CI/CD is fixed.
  - Run `npx changeset` to select specific packages to bump ( use up & down arrows to navigate, space to select specific packages). This will create a new changeset file in `./changesets` folder. Update changelog in changeset file if needed using `feat:`, `fix:`, `docs:`, `chore:` or `refactor:` prefixes.
  - Create a PR with changeset file.
  - After the PR is approved & merged. You will need to run `npx changeset version` to bump all the versions of the packages -> create a PR.
  - After the PR is merged make sure to run build & tests uisng `pnpm build-skip-nx-cache` && `pnpm test-skip-nx-cache`.
  - After the tests passes run `npx changeset publish` this publishes the packages to npm.
  - Finally create changeset tags using `npx changeset tag`` and push tags ( make sure you are signing tags before pushing ) to git.

<!-- TODO: once we have CI/CD steps fully defined we should validate this is accurate -->

- We use github actions for CI/CD. See [workflows](.github/workflows) for more info.
  - `ci.yml` - runs on every push to any branch --> runs tests.

---

### Determinstic Builds & Secure Publishes

- We use [slsa framework](https://slsa.dev/) _pronounced "salsa"_ for reproducible builds & secure pushes. Verification is done using [provenance](https://slsa.dev/provenance/v1)
