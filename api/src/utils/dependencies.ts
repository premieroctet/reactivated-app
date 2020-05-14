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

export const getDependenciesByFirstLetter = packageJson => {
  const { dependencies } = packageJson;
  const dependenciesByFirstLetter = {};
  Object.keys(dependencies).forEach(dep => {
    if (dependenciesByFirstLetter[dep[0]]) {
      dependenciesByFirstLetter[dep[0]].push(dep);
    } else {
      dependenciesByFirstLetter[dep[0]] = [dep];
    }
  });
  return dependenciesByFirstLetter;
};
