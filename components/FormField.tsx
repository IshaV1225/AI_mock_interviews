/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

// FormFieldProps can be a name, a value, whatever we dynamically pass to it will take the form of the generic T value
// The following are props
interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = ({ control, name, label, placeholder, type = "text"}: FormFieldProps<T>) => (
    // using react hook 'Controller' with props to make this component re-useable
    <Controller 
        control={control} 
        name={name} 
        render={({ field }) => 
        (
            <FormItem>
                <FormLabel className='label'>{label}</FormLabel>
                <FormControl>
                    <Input 
                        className="input"
                        placeholder={placeholder} {...field} 
                        type={type}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
)

export default FormField