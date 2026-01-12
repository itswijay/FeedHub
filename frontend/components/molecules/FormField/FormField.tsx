'use client'

import React from 'react'
import {
  Label,
  Input,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/atoms'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  error?: string
  className?: string
  inputProps?: React.ComponentProps<'input'>
}

function FormFieldMolecule({
  label,
  error,
  className,
  inputProps,
  ...props
}: FormFieldProps & React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItem className={className}>
      <Label htmlFor={id} className={error ? 'text-destructive' : ''}>
        {label}
      </Label>
      <Input id={id} aria-invalid={!!error} {...inputProps} />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </FormItem>
  )
}

export { FormFieldMolecule }
