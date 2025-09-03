"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import FormError from "../ui/form-error"
import { useField, useFormikContext } from "formik";

export default function Combobox({options=[],
    lableString="",
    valueString="",
    placeholder="Select opt...",
    onChange
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
    
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((opt) => opt?.[valueString] === value)?.[lableString]
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent >
        <Command>
          <CommandInput placeholder="Search opt..." className="h-9" />
          <CommandList>
            <CommandEmpty>No opt found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt?.[valueString]}
                  value={opt?.[valueString]}
                  onSelect={(currentValue) => {
                    setValue(opt[valueString])
                    onChange(opt[valueString])
                    setOpen(false)
                  }}
                >
                  {opt?.[lableString]}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === opt?.[valueString] ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


export function FormikCombobox(props) {
//   const { handleChange, isError, helperText, field, classNames } = useFormikTypeAheadInput(props);
  const { name, classNames = {}, onChange } = props;
  const [field, meta, { setValue }] = useField(name);

  const { submitCount } = useFormikContext();
  const isError = submitCount > 0 && !!meta.error;
  const helperText = (submitCount > 0 && meta.error) || "";

  const handleChange = (value, meta) => {
    setValue(value);
    onChange && onChange(value, meta);
  };

  return (
    <>
      <Combobox {...props} {...field} onChange={handleChange} />
      <FormError show={isError} message={helperText} className={classNames.error} />
    </>
  );
}