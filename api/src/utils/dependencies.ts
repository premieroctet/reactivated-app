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

  for (const library in dependencies) {
    if (library === FrameworkWhiteList.REACT) {
      return 'react';
    }
    if (library === FrameworkWhiteList.REACTNATIVE) {
      return 'react native';
    }
    if (library === FrameworkWhiteList.VUE) {
      return 'vue';
    }
    if (library === FrameworkWhiteList.ANGULAR) {
      return 'angular';
    }
    if (library === FrameworkWhiteList.NEXTJS) {
      return 'next.js';
    }
    if (library === FrameworkWhiteList.NESTJS) {
      return 'nest.js';
    }
    if (library === FrameworkWhiteList.EXPRESS) {
      return 'express';
    }
  }
};
