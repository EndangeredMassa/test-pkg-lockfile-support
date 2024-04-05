import { execa } from 'execa';
import semver from 'semver';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPPORTED_MAJORS = [6, 7, 8];
// const EXTRA_VERSIONS = ['9.0.0-beta.3']

/*
{ pnpmVersion: '6.0.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.0.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.0.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.1.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.2.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.2.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.2.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.2.3', lockfileVersion: '5.3' }
{ pnpmVersion: '6.2.4', lockfileVersion: '5.3' }
{ pnpmVersion: '6.2.5', lockfileVersion: '5.3' }
{ pnpmVersion: '6.3.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.4.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.5.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.6.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.6.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.6.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.7.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.7.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.7.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.7.3', lockfileVersion: '5.3' }
{ pnpmVersion: '6.7.4', lockfileVersion: '5.3' }
{ pnpmVersion: '6.7.5', lockfileVersion: '5.3' }
{ pnpmVersion: '6.7.6', lockfileVersion: '5.3' }
{ pnpmVersion: '6.8.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.9.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.9.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.10.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.10.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.10.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.10.3', lockfileVersion: '5.3' }
{ pnpmVersion: '6.11.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.11.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.11.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.11.3', lockfileVersion: '5.3' }
{ pnpmVersion: '6.11.4', lockfileVersion: '5.3' }
{ pnpmVersion: '6.11.5', lockfileVersion: '5.3' }
{ pnpmVersion: '6.12.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.12.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.13.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.14.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.14.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.14.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.14.3', lockfileVersion: '5.3' }
{ pnpmVersion: '6.14.4', lockfileVersion: '5.3' }
{ pnpmVersion: '6.14.5', lockfileVersion: '5.3' }
{ pnpmVersion: '6.14.6', lockfileVersion: '5.3' }
{ pnpmVersion: '6.14.7', lockfileVersion: '5.3' }
{ pnpmVersion: '6.15.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.15.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.15.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.16.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.16.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.17.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.17.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.17.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.18.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.19.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.19.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.20.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.20.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.20.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.20.3', lockfileVersion: '5.3' }
{ pnpmVersion: '6.20.4', lockfileVersion: '5.3' }
{ pnpmVersion: '6.21.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.21.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.22.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.22.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.22.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.23.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.23.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.23.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.23.3', lockfileVersion: '5.3' }
{ pnpmVersion: '6.23.4', lockfileVersion: '5.3' }
{ pnpmVersion: '6.23.5', lockfileVersion: '5.3' }
{ pnpmVersion: '6.23.6', lockfileVersion: '5.3' }
{ pnpmVersion: '6.24.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.24.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.24.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.24.3', lockfileVersion: '5.3' }
{ pnpmVersion: '6.24.4', lockfileVersion: '5.3' }
{ pnpmVersion: '6.25.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.25.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.26.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.26.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.27.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.27.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.27.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.28.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.29.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.29.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.29.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.30.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.30.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.31.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.2', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.3', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.4', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.5', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.6', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.7', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.8', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.9', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.10', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.11', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.12', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.13', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.14', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.15', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.16', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.17', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.18', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.19', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.20', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.21', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.22', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.23', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.24', lockfileVersion: '5.3' }
{ pnpmVersion: '6.32.25', lockfileVersion: '5.3' }
{ pnpmVersion: '6.33.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.33.1', lockfileVersion: '5.3' }
{ pnpmVersion: '6.34.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.35.0', lockfileVersion: '5.3' }
{ pnpmVersion: '6.35.1', lockfileVersion: '5.3' }
{ pnpmVersion: '7.0.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.0.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.3', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.4', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.5', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.6', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.7', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.8', lockfileVersion: '5.4' }
{ pnpmVersion: '7.1.9', lockfileVersion: '5.4' }
{ pnpmVersion: '7.2.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.2.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.3.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.4.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.4.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.5.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.5.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.5.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.6.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.7.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.7.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.8.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.9.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.9.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.9.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.9.3', lockfileVersion: '5.4' }
{ pnpmVersion: '7.9.4', lockfileVersion: '5.4' }
{ pnpmVersion: '7.9.5', lockfileVersion: '5.4' }
{ pnpmVersion: '7.10.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.11.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.12.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.12.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.12.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.13.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.13.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.13.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.13.3', lockfileVersion: '5.4' }
{ pnpmVersion: '7.13.4', lockfileVersion: '5.4' }
{ pnpmVersion: '7.13.5', lockfileVersion: '5.4' }
{ pnpmVersion: '7.13.6', lockfileVersion: '5.4' }
{ pnpmVersion: '7.14.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.14.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.14.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.15.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.16.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.16.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.17.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.17.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.18.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.18.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.18.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.19.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.20.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.21.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.22.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.23.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.24.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.24.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.24.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.24.3', lockfileVersion: '5.4' }
{ pnpmVersion: '7.25.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.25.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.26.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.26.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.26.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.26.3', lockfileVersion: '5.4' }
{ pnpmVersion: '7.27.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.27.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.28.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.29.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.29.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.29.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.29.3', lockfileVersion: '5.4' }
{ pnpmVersion: '7.30.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.30.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.30.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.30.3', lockfileVersion: '5.4' }
{ pnpmVersion: '7.30.4', lockfileVersion: '5.4' }
{ pnpmVersion: '7.30.5', lockfileVersion: '5.4' }
{ pnpmVersion: '7.31.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.32.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.32.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.32.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.32.3', lockfileVersion: '5.4' }
{ pnpmVersion: '7.32.4', lockfileVersion: '5.4' }
{ pnpmVersion: '7.32.5', lockfileVersion: '5.4' }
{ pnpmVersion: '7.33.0', lockfileVersion: '5.4' }
{ pnpmVersion: '7.33.1', lockfileVersion: '5.4' }
{ pnpmVersion: '7.33.2', lockfileVersion: '5.4' }
{ pnpmVersion: '7.33.3', lockfileVersion: '5.4' }
{ pnpmVersion: '7.33.4', lockfileVersion: '5.4' }
{ pnpmVersion: '7.33.5', lockfileVersion: '5.4' }
{ pnpmVersion: '7.33.6', lockfileVersion: '5.4' }
{ pnpmVersion: '7.33.7', lockfileVersion: '5.4' }
{ pnpmVersion: '8.0.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.1.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.1.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.2.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.3.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.3.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.4.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.5.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.5.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.0', lockfileVersion: '6.1' }
{ pnpmVersion: '8.6.1', lockfileVersion: '6.1' }
{ pnpmVersion: '8.6.2', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.3', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.4', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.5', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.6', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.7', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.8', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.9', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.10', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.11', lockfileVersion: '6.0' }
{ pnpmVersion: '8.6.12', lockfileVersion: '6.0' }
{ pnpmVersion: '8.7.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.7.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.7.2', lockfileVersion: '6.0' }
{ pnpmVersion: '8.7.3', lockfileVersion: '6.0' }
{ pnpmVersion: '8.7.4', lockfileVersion: '6.0' }
{ pnpmVersion: '8.7.5', lockfileVersion: '6.0' }
{ pnpmVersion: '8.7.6', lockfileVersion: '6.0' }
{ pnpmVersion: '8.8.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.9.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.9.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.9.2', lockfileVersion: '6.0' }
{ pnpmVersion: '8.10.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.10.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.10.2', lockfileVersion: '6.0' }
{ pnpmVersion: '8.10.3', lockfileVersion: '6.0' }
{ pnpmVersion: '8.10.4', lockfileVersion: '6.0' }
{ pnpmVersion: '8.10.5', lockfileVersion: '6.0' }
{ pnpmVersion: '8.11.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.12.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.12.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.13.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.13.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.14.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.14.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.14.2', lockfileVersion: '6.0' }
{ pnpmVersion: '8.14.3', lockfileVersion: '6.0' }
{ pnpmVersion: '8.15.0', lockfileVersion: '6.0' }
{ pnpmVersion: '8.15.1', lockfileVersion: '6.0' }
{ pnpmVersion: '8.15.2', lockfileVersion: '6.0' }
{ pnpmVersion: '8.15.3', lockfileVersion: '6.0' }
{ pnpmVersion: '8.15.4', lockfileVersion: '6.0' }
{ pnpmVersion: '8.15.5', lockfileVersion: '6.0' }
{ pnpmVersion: '8.15.6', lockfileVersion: '6.0' }
{ pnpmVersion: '9.0.0-beta.3', lockfileVersion: '7.0' }
*/

// NODE 18 //

/*
{
  lockfileVersion: '5.3',
  pnpmVersion: '6.35.1',
  result: 'success'
}
{
  lockfileVersion: '5.3',
  pnpmVersion: '7.33.7',
  result: 'success'
}
{
  lockfileVersion: '5.3',
  pnpmVersion: '8.15.6',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@8.15.6 install --frozen-lockfile\n' +
    ' ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE  Cannot perform a frozen installation because the version of the lockfile is incompatible with this version of pnpm'
}
{
  lockfileVersion: '5.3',
  pnpmVersion: '9.0.0-beta.3',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@9.0.0-beta.3 install --frozen-lockfile\n' +
    ' ERR_PNPM_LOCKFILE_BREAKING_CHANGE  Lockfile /Users/smassa/source/demo/test-pkg-lockfile-support/output/pnpm-6.35.1/pnpm-lock.yaml not compatible with current pnpm'
}
{
  lockfileVersion: '5.4',
  pnpmVersion: '6.35.1',
  result: 'success'
}
{
  lockfileVersion: '5.4',
  pnpmVersion: '7.33.7',
  result: 'success'
}
{
  lockfileVersion: '5.4',
  pnpmVersion: '8.15.6',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@8.15.6 install --frozen-lockfile\n' +
    ' ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE  Cannot perform a frozen installation because the version of the lockfile is incompatible with this version of pnpm'
}
{
  lockfileVersion: '5.4',
  pnpmVersion: '9.0.0-beta.3',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@9.0.0-beta.3 install --frozen-lockfile\n' +
    ' ERR_PNPM_LOCKFILE_BREAKING_CHANGE  Lockfile /Users/smassa/source/demo/test-pkg-lockfile-support/output/pnpm-7.33.7/pnpm-lock.yaml not compatible with current pnpm'
}
{
  lockfileVersion: '6.0',
  pnpmVersion: '6.35.1',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@6.35.1 install --frozen-lockfile\n' +
    'Recreating /Users/smassa/source/demo/test-pkg-lockfile-support/output/pnpm-8.15.6/node_modules\n' +
    ' ERR_PNPM_LOCKFILE_BREAKING_CHANGE  Lockfile /Users/smassa/source/demo/test-pkg-lockfile-support/output/pnpm-8.15.6/pnpm-lock.yaml not compatible with current pnpm'
}
{
  lockfileVersion: '6.0',
  pnpmVersion: '7.33.7',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@7.33.7 install --frozen-lockfile\n' +
    ` ERR_PNPM_LOCKFILE_CONFIG_MISMATCH  Cannot proceed with the frozen installation. The current "settings.autoInstallPeers" configuration doesn't match the value found in the lockfile`
}
{
  lockfileVersion: '6.0',
  pnpmVersion: '8.15.6',
  result: 'success'
}
{
  lockfileVersion: '6.0',
  pnpmVersion: '9.0.0-beta.3',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@9.0.0-beta.3 install --frozen-lockfile\n' +
    ' ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE  Cannot perform a frozen installation because the version of the lockfile is incompatible with this version of pnpm'
}
{
  lockfileVersion: '7.0',
  pnpmVersion: '6.35.1',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@6.35.1 install --frozen-lockfile\n' +
    ' ERR_PNPM_LOCKFILE_BREAKING_CHANGE  Lockfile /Users/smassa/source/demo/test-pkg-lockfile-support/output/pnpm-9.0.0-beta.3/pnpm-lock.yaml not compatible with current pnpm'
}
{
  lockfileVersion: '7.0',
  pnpmVersion: '7.33.7',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@7.33.7 install --frozen-lockfile\n' +
    ' ERR_PNPM_LOCKFILE_BREAKING_CHANGE  Lockfile /Users/smassa/source/demo/test-pkg-lockfile-support/output/pnpm-9.0.0-beta.3/pnpm-lock.yaml not compatible with current pnpm'
}
{
  lockfileVersion: '7.0',
  pnpmVersion: '8.15.6',
  result: 'error',
  reason: 'Command failed with exit code 1: npx --yes pnpm@8.15.6 install --frozen-lockfile\n' +
    ' ERR_PNPM_LOCKFILE_BREAKING_CHANGE  Lockfile /Users/smassa/source/demo/test-pkg-lockfile-support/output/pnpm-9.0.0-beta.3/pnpm-lock.yaml not compatible with current pnpm'
}
{
  lockfileVersion: '7.0',
  pnpmVersion: '9.0.0-beta.3',
  result: 'success'
}
*/

/** maps lockfile versions to latest pnpm version that generates it */
const LOCKFILE_VERSIONS_TO_LATEST_PNPM = {
  '5.3': '6.35.1',
  '5.4': '7.33.7',
  '6.0': '8.15.6',
  '7.0': '9.0.0-beta.3',
};

function tryParse(string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    throw new Error(`Error "${error.message}" when parsing:\n${string}`);
  }
}

async function $(commandString, options={}) {
  const [command, ...args] = commandString.split(' ');
  
  const { stdout, stderr, exitCode } = await execa(command, args, options);
  if (exitCode !== 0) {
    throw new Error(`Command "${commandString}" exited with ${exitCode}:\n${stderr}`);  
  }
  
  return stdout;
}

async function $pnpm(pnpmVersion, args, options={}) {
  // use `--yes` to skip the npx install prompt
  return $(`npx --yes pnpm@${pnpmVersion} ${args}`, options);
}

async function pnpmListVersions() {
  const output = await $('npm view pnpm versions --json');

  const versions = tryParse(output);
  const filteredVersions = versions.filter(v => {
    if (v.includes('-')) {
      return false;
    }
    
    const majorVersion = semver.parse(v).major;
    if (SUPPORTED_MAJORS.includes(majorVersion)) {
      return true;
    }
    
    return false;
  });
  
  return filteredVersions;
}

function rmDir(dir) {
  return new Promise(function(resolve, reject) {
    fs.rm(dir, { recursive: true, force: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
}

function parseLockfileVersion(contents) {
  // the lockfileVersion value can be a number or a string
  // so the regex has option quotes
  const matches = /lockfileVersion: [']*([^'\n]+)[']*/.exec(contents);
  if (matches && matches.length > 1) {
    return matches[1]
  }
}

async function determineLockfileVersion(outDir, pnpmVersion) {
  const projectDir = path.join(outDir, `pnpm-${pnpmVersion}`);
  const lockfilePath = path.join(projectDir, 'pnpm-lock.yaml');
  
  fs.mkdirSync(projectDir, { recursive: true });
  
  // older versions need `-f`
  const majorVersion = semver.parse(pnpmVersion).major;
  
  const initFlags = majorVersion === 6 ? ' -f' : '';
  await $pnpm(pnpmVersion, `init${initFlags}`, { cwd: projectDir });
  
  // older verisons need to install a package to generate a lockfile
  // so we picked a tiny package
  await $pnpm(pnpmVersion, `install leftpad`, { cwd: projectDir });
  
  const lockfileContents = fs.readFileSync(lockfilePath).toString();
  const lockfileVersion = parseLockfileVersion(lockfileContents);
  
  if (!lockfileVersion) {
    throw new Error(`Could not identify lockfile version from "${lockfilePath}":\n${lockfileContents}`);
  }
  return lockfileVersion;
}

/** for each pnpm version in the supported major versions, determine which lockfile version is generateed */
async function determineGeneratedLockfileVersions(versions, outDir) {
  for (const pnpmVersion of versions) {
    const lockfileVersion = await determineLockfileVersion(outDir, pnpmVersion);

    console.log({
      pnpmVersion,
      lockfileVersion
    });

  }
}

/** for each lockfile version, we'll test an install using each latest major versions of pnpm that we support */
async function determineLockfileCompatibility(versions, outDir) {
  const pnpmVersions = Object.values(LOCKFILE_VERSIONS_TO_LATEST_PNPM);
  
  for (const [lockfileVersion, latestPnpmVersion] of Object.entries(LOCKFILE_VERSIONS_TO_LATEST_PNPM)) {
    for (const pnpmVersion of pnpmVersions) {
      // we're using the latest pnpm version of a given lockfile generation
      // as a place to find a project of that lockfile version, but it
      // shouldn't mattter which pnpm version actually generated it
      const projectPath = path.join(outDir, `pnpm-${latestPnpmVersion}`);
      
      let error;
      try {
        await $pnpm(pnpmVersion, `install --frozen-lockfile`, { cwd: projectPath });
      } catch (err) {
        error = err;
      }
      
      let result = 'success';
      let reason;
      if (error) {
        result = 'error';
        reason = error.message;
      }
      
      console.log({
        lockfileVersion,
        pnpmVersion,
        result,
        reason
      });
    }
  }
}

async function main() {
  const outDir = path.join(__dirname, 'output');
  
  // TODO: restore
  // await rmDir(outDir);
  
  const versions = await pnpmListVersions();
  // const versions = ['9.0.0-beta.3'];
  
  // await determineGeneratedLockfileVersions(versions, outDir);
  
  await determineLockfileCompatibility(versions, outDir);

}


main().catch(console.error);

