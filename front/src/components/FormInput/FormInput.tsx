import React, { memo } from 'react'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormControlProps,
} from '@chakra-ui/core'

interface Props extends FormControlProps {
  label?: string
  id?: string
  children: React.ReactNode
  helperText?: React.ReactNode
}

const FormInput: React.FC<Props> = memo(
  ({ label, id, children, helperText, ...props }) => {
    return (
      <FormControl {...props}>
        {!!label && <FormLabel htmlFor={id}>{label}</FormLabel>}
        {children}
        {!!helperText && <FormHelperText id={id}>{helperText}</FormHelperText>}
      </FormControl>
    )
  },
)

export default FormInput
