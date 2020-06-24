export const getDependenciesCount = (packageJson: PackageJson | undefined) => {
  let totalDependencies = 0
  if (packageJson?.dependencies) {
    totalDependencies += Object.keys(packageJson.dependencies).length
  }
  if (packageJson?.devDependencies) {
    totalDependencies += Object.keys(packageJson.devDependencies).length
  }
  return totalDependencies
}

export const refinedDependency = (dependency: DependencyArray): Dependency => ({
  name: dependency[0],
  current: dependency[1],
  wanted: dependency[2],
  latest: dependency[3],
  type: dependency[4],
  url: dependency[5],
})

export const getNewScore = (
  nbSelectedDependencies: number,
  nbOutdatedDependencies: number,
  packageJson: PackageJson | undefined,
) => {
  if (packageJson === undefined) {
    return 0
  }
  const totalDependencies = Object.keys(packageJson!.dependencies).length
  const newScore = Math.round(
    100 -
      ((nbOutdatedDependencies - nbSelectedDependencies) / totalDependencies) *
        100,
  )
  return newScore
}
