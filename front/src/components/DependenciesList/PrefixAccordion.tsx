import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/core'
import React from 'react'
import DependencyItem from './DependencyItem'

interface PrefixAccordionProps {
  prefix: string
  prefixedDep: PrefixedDependency
  packages: { [key: string]: 'stable' | 'latest' }
  setPackages: any // hook setState type ?
}

const PrefixAccordion: React.FC<PrefixAccordionProps> = ({
  prefix,
  prefixedDep,
  packages,
  setPackages,
}) => {
  if (prefixedDep[prefix].length > 1) {
    return (
      <Accordion allowToggle p={0}>
        <AccordionItem defaultIsOpen>
          <AccordionHeader pt={2} px={0}>
            <Box flex="1" textAlign="left">
              {prefix}
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel px={0} pb={4}>
            {prefixedDep[prefix].map((dep: Dependency) => {
              return (
                <DependencyItem
                  isStableChecked={packages[dep[0]] === 'stable'}
                  isLatestChecked={packages[dep[0]] === 'latest'}
                  onSelect={(checked, name, type) => {
                    if (checked) {
                      setPackages({ ...packages, [name]: type })
                    } else {
                      const { [name]: omit, ...rest } = packages
                      setPackages({ ...rest })
                    }
                  }}
                  dependency={dep}
                  key={dep[0]}
                />
              )
            })}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  } else if (prefixedDep[prefix].length === 1) {
    return (
      <DependencyItem
        isStableChecked={packages[prefixedDep[prefix][0][0]] === 'stable'}
        isLatestChecked={packages[prefixedDep[prefix][0][0]] === 'latest'}
        onSelect={(checked, name, type) => {
          if (checked) {
            setPackages({ ...packages, [name]: type })
          } else {
            const { [name]: omit, ...rest } = packages
            setPackages({ ...rest })
          }
        }}
        dependency={prefixedDep[prefix][0]}
        key={prefixedDep[prefix][0][0]} // warning?
      />
    )
  } else {
    return <React.Fragment> </React.Fragment>
  }
}

export default PrefixAccordion
