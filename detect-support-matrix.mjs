import { execa } from 'execa';
import semver from 'semver';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*

  NOTE: pnpm@9.x requires node@18+

*/

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPPORTED_MAJORS = [6, 7, 8, 9];

/** maps lockfile versions to latest pnpm version that generates it */
const LOCKFILE_VERSIONS_TO_LATEST_PNPM = {
  '5.3': '6.35.1',
  '5.4': '7.33.7',
  '6.0': '8.15.6',
  '7.0': '9.0.0', // 7.0 was removed
  // 8.0 never existed
  '9.0': '9.0.0',
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
  
  await determineGeneratedLockfileVersions(versions, outDir);
  
  await determineLockfileCompatibility(versions, outDir);
}


main().catch(console.error);

