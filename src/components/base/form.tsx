// @ts-nocheck
'use client'

import type * as LabelPrimitive from '@radix-ui/react-label'

import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'
import { Slot } from '@radix-ui/react-slot'
import { createContext, use, useId, useMemo } from 'react'
import { Controller, FormProvider, useFormContext, useFormState } from 'react-hook-form'
import { cn } from '~/utils/cn'

import { Label } from './label'

const Form = FormProvider

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue)
FormFieldContext.displayName = 'FormFieldContext'

type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName>

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldProps<TFieldValues, TName>) {
  const { name } = props
  const value = useMemo(() => ({ name }), [name])

  return (
    <FormFieldContext value={value}>
      <Controller {...props} />
    </FormFieldContext>
  )
}

function useFormField() {
  const fieldContext = use(FormFieldContext)
  // eslint-disable-next-line ts/no-use-before-define
  const itemContext = use(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

interface FormItemContextValue {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)
FormItemContext.displayName = 'FormItemContext'

type FormItemProps = React.ComponentProps<'div'>

function FormItem(props: FormItemProps) {
  const { className, ...rest } = props
  const id = useId()
  const value = useMemo(() => ({ id }), [id])

  return (
    <FormItemContext value={value}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...rest} />
    </FormItemContext>
  )
}

type FormLabelProps = React.ComponentProps<typeof LabelPrimitive.Root>

function FormLabel(props: FormLabelProps) {
  const { className, ...rest } = props
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...rest}
    />
  )
}

type FormControlProps = React.ComponentProps<typeof Slot>

function FormControl(props: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={!!error}
      {...props}
    />
  )
}

type FormDescriptionProps = React.ComponentProps<'p'>

function FormDescription(props: FormDescriptionProps) {
  const { className, ...rest } = props
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...rest}
    />
  )
}

type FormMessageProps = React.ComponentProps<'p'>

function FormMessage(props: FormMessageProps) {
  const { className, children, ...rest } = props
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? '') : children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...rest}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
