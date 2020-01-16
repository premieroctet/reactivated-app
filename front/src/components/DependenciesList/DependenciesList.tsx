import React from 'react'
import DependencyItem from './DependencyItem'
import './DependencyList.scss'

interface Props {
  dependencies: {
    deps: Dependency[]
  }
}

const DependenciesList = ({ dependencies }: Props) => {
  return (
    <div className="package-list">
      <p className="name-content">Dependency</p>
      <p className="required-content">Required</p>
      <p className="stable-content">Stable</p>
      <p className="latest-content">Latest</p>
      <p className="status-content">Status</p>
      {dependencies.deps.map((key, index) => (
        <DependencyItem key={index} dependency={key} />
      ))}
    </div>
  )
}

export default DependenciesList
