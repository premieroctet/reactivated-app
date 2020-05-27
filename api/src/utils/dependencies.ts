import {
  FrameworkWhiteList,
  FrameworkTag,
} from '../repository/repository.entity';

export const getDependenciesCount = packageJson => {
  let totalDependencies = 0;
  if (packageJson?.dependencies) {
    totalDependencies += Object.keys(packageJson.dependencies).length;
  }
  if (packageJson?.devDependencies) {
    totalDependencies += Object.keys(packageJson.devDependencies).length;
  }
  return totalDependencies;
};

export const getNbOutdatedDeps = dependencies => {
  let nbOutdatedDevDeps = 0,
    nbOutdatedDeps = 0;
  for (const dep of dependencies) {
    if (dep[4] === 'devDependencies') {
      nbOutdatedDevDeps++;
    } else {
      nbOutdatedDeps++;
    }
  }

  return [nbOutdatedDeps, nbOutdatedDevDeps];
};

export const getFrameworkFromPackageJson = (packageJson): FrameworkTag => {
  const { dependencies } = packageJson;

  const frameworkPriorityMap = {
    [FrameworkWhiteList.REACT]: 1,
    [FrameworkWhiteList.REACTNATIVE]: 2,
    [FrameworkWhiteList.NEXTJS]: 2,
    [FrameworkWhiteList.VUE]: 1,
    [FrameworkWhiteList.ANGULAR]: 1,
    [FrameworkWhiteList.NESTJS]: 1,
    [FrameworkWhiteList.EXPRESS]: 1,
  };

  const frameworkToLabelMap = {
    [FrameworkWhiteList.REACT]: 'react',
    [FrameworkWhiteList.REACTNATIVE]: 'react native',
    [FrameworkWhiteList.NEXTJS]: 'next.js',
    [FrameworkWhiteList.VUE]: 'vue',
    [FrameworkWhiteList.ANGULAR]: 'angular',
    [FrameworkWhiteList.NESTJS]: 'nest.js',
    [FrameworkWhiteList.EXPRESS]: 'express',
  };

  let mainFramework = null;
  Object.keys(frameworkPriorityMap).forEach(framework => {
    if (dependencies[framework] && mainFramework === null) {
      mainFramework = framework;
    }

    if (
      dependencies[framework] &&
      mainFramework &&
      frameworkPriorityMap[framework] > frameworkPriorityMap[mainFramework]
    ) {
      mainFramework = framework;
    }
  });

  return frameworkToLabelMap[mainFramework];
};

type packageInfo = {
  packageLabel?: string;
  current?: string;
  wanted?: string;
  latest?: string;
  package_type?: string;
  url?: string;
};
const headers = [
  'packageLabel',
  'current',
  'wanted',
  'latest',
  'package_type',
  'url',
];
export const parseOutdatedPackage = (outdatedDep): packageInfo => {
  const parsedPackage: packageInfo = {};
  for (let i = 0; i < headers.length; i++) {
    parsedPackage[headers[i]] = outdatedDep[i];
  }
  return parsedPackage;
};

export const getPrefixedDependencies = outdatedDeps => {
  const dependenciesByFirstLetter = {};
  for (const dep of outdatedDeps) {
    const { packageLabel } = parseOutdatedPackage(dep);

    if (dependenciesByFirstLetter[packageLabel[0]]) {
      dependenciesByFirstLetter[packageLabel[0]].push(dep);
    } else {
      dependenciesByFirstLetter[packageLabel[0]] = [dep];
    }
  }

  const prefixedDependencies = [];

  for (const firstLetter in dependenciesByFirstLetter) {
    const dependencies = dependenciesByFirstLetter[firstLetter];

    if (dependencies.length === 1) {
      prefixedDependencies.push(...dependencies);
    } else {
      let depIdx = 0;
      let commonPrefixDeps = [];
      let packageSplit = parseOutdatedPackage(
        dependencies[depIdx],
      ).packageLabel.split('/');

      // Find dependencies with same prefix
      while (depIdx < dependencies.length) {
        //   If there is a prefix
        if (packageSplit.length > 1) {
          let commonPrefix = packageSplit[0];

          // If common prefix is not the same, reset the common prefix
          if (
            parseOutdatedPackage(dependencies[depIdx]).packageLabel.split(
              '/',
            )[0] !== commonPrefix
          ) {
            prefixedDependencies.push({
              [commonPrefix + '/']: commonPrefixDeps,
            });
            // commonPrefixDeps = [dependencies[depIdx]];
            commonPrefixDeps = [];
            packageSplit = parseOutdatedPackage(
              dependencies[depIdx],
            ).packageLabel.split('/');
            commonPrefix = packageSplit[0];
          }

          // If common prefix is the same, add to common prefix dep array
          commonPrefixDeps.push(dependencies[depIdx]);

          // No more dependencies to check
          if (depIdx === dependencies.length - 1) {
            prefixedDependencies.push({
              [commonPrefix + '/']: commonPrefixDeps,
            });
          }

          depIdx++;
        } else {
          //   No prefix
          prefixedDependencies.push(dependencies[depIdx]);
          depIdx++;
        }
      }
    }
  }

  return prefixedDependencies;
};

// Exemple:
/* 
    diff --git a/package.json b/package.json
    index b7b535b..10b3909 100644
    --- a/package.json
    +++ b/package.json
    @@ -16,7 +16,7 @@
      "@vue/cli-plugin-eslint": "^4.3.0",
      "@vue/cli-service": "^4.3.0",
    */
export const getUpgradedDiff = diffLines => {
  const upgradedDiff = {};
  if (diffLines.length > 6) {
    for (let i = 5; i < diffLines.length; i++) {
      if (diffLines[i][0] === '+' || diffLines[i][0] === '-') {
        const dep = diffLines[i].split('"')[1];
        if (upgradedDiff[dep] === undefined) {
          upgradedDiff[dep] = [diffLines[i]];
        } else {
          upgradedDiff[dep].push(diffLines[i]);
        }
      }
    }
  }
  return upgradedDiff;
};
