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
