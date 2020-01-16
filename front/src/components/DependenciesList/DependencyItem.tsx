import React, { memo } from 'react'
import semver from 'semver'

interface Props {
  dependency: Dependency
}

const DependencyItem = memo(({ dependency }: Props) => {
  const loadStatus = () => {
    if (semver.satisfies(dependency[2], dependency[3])) {
      return 'green'
    } else {
      return 'orange'
    }
  }

  return (
    <div className="package-item">
      <p className="package-name">{dependency[0]}</p>
      <p className="package-required">{dependency[1]}</p>
      <p className="package-stable">{dependency[2]}</p>
      <p className="package-latest">{dependency[3]}</p>
      <div className={`package-status ${loadStatus()}`} />
    </div>
  )
})

export default DependencyItem
