import { Repository } from '@typings/entities'

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
  let totalDependencies = 0
  if (packageJson) {
    if (packageJson.dependencies) {
      totalDependencies += Object.keys(packageJson.dependencies).length
    }
    if (packageJson.devDependencies) {
      totalDependencies += Object.keys(packageJson.devDependencies).length
    }
  } else {
    return 0
  }

  const newScore = Math.round(
    100 -
      ((nbOutdatedDependencies - nbSelectedDependencies) / totalDependencies) *
        100,
  )
  return newScore
}

export const sortDependencies = (repository: Repository) => {
  let dependencies: Dependency[] = []
  let devDependencies: Dependency[] = []

  repository?.dependencies?.deps.forEach(
    (dep: DependencyArray | PrefixedDependency) => {
      if (Array.isArray(dep)) {
        const depObject = refinedDependency(dep)
        depObject.type === 'dependencies'
          ? dependencies.push(depObject)
          : devDependencies.push(depObject)
      } else {
        const prefix = Object.keys(dep)[0]
        const type = dep[prefix][0][4]
        dependencies = [
          ...dependencies,
          ...dep[prefix]
            .filter((dep) => dep[4] === type)
            .map((dep) => ({ ...refinedDependency(dep), prefix })),
        ]
      }
    },
  )

  return { dependencies, devDependencies }
}
