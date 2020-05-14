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
