import React from 'react'
import { Flex } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import RepositoryListItem from './RepositoryListItem'
import { Repository } from '../../typings/entities'
import RepositoryListEmpty from './RepositoryListEmpty'
import { getMaxRepositories } from '@containers/Dashboard'
import { motion } from 'framer-motion'

interface Props {
  repositories: Repository[]
}

const MotionRepositoryListItem = motion.custom(RepositoryListItem)
const MotionRepositoryListEmpty = motion.custom(RepositoryListEmpty)

const RepositoriesList = ({ repositories }: Props) => {
  const emptyBlockCount = getMaxRepositories() - repositories.length

  return (
    <Flex flexDirection="column">
      {repositories.map((repository) => {
        if (repository.isConfigured) {
          return (
            <Link key={repository.id} to={`/repo/${repository.id}`}>
              <MotionRepositoryListItem
                repository={repository}
                whileHover={{ scale: 1.02, x: 10 }}
              />
            </Link>
          )
        } else {
          return (
            <RepositoryListItem key={repository.id} repository={repository} />
          )
        }
      })}
      {[...new Array(emptyBlockCount < 0 ? 0 : emptyBlockCount)].map(
        (_, idx) => (
          <MotionRepositoryListEmpty
            whileHover={{ scale: 1.02, x: 10 }}
            key={idx}
          />
        ),
      )}
    </Flex>
  )
}

export default RepositoriesList
