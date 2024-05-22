
import * as React from 'react'
import { cn } from "@/lib/utils"

import { Check, X, ChevronsUpDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, ButtonProps } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandProps } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type OptionType = {
  label: string
  value: string
}

export interface MultiSelectProps extends Omit<ButtonProps, 'onSelect'> {
  options: OptionType[]
  selected: string[]
  onSelect: (value: string[]) => void
  commandProps?: CommandProps
}

function MultiSelect({
  options, selected, onSelect, commandProps,
  className, variant = "outline", ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: OptionType) => {
    const values = selected.includes(option.value)
      ? selected.filter((item) => item !== option.value)
      : [...selected, option.value]

    onSelect(values)
    setOpen(true)
  }

  const handleUnselect = (item: string) => {
    onSelect(selected.filter((i) => i !== item))
  }

  const getLabel = (value: string): string => {
    const option = options.find((option) => option.value === value)
    return option?.label || 'Label not found.'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className={cn("w-full flex-1 h-fit sm:h-fit justify-between rounded-3xl", className)}
          variant={variant}
          role="combobox"
          aria-expanded={open}
          onClick={() => setOpen((open) => !open)}
          {...props}
        >
          <div className="w-5/6 max-w-fit flex flex-wrap gap-x-2 gap-y-1 sm:w-11/12">
            {selected.length ? selected.map((item) => (
              <Badge className="w-full max-w-fit px-2.5 py-0.5 icon-wrapper"
                variant="secondary"
                size="sm"
                key={item}
                onClick={() => handleUnselect(item)}
              >
                <span className="truncate">{getLabel(item)}</span>
                <a className="border ring-offset-background rounded-full outline-none hover:ring-1 hover:ring-destructive hover:ring-offset focus:ring-1 focus:ring-destructive focus:ring-offset"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive focus:text-destructive" />
                </a>
              </Badge>
            )) : (
              <span className="text-sm font-normal text-muted-foreground truncate">
                Select from available options...
              </span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <Command {...commandProps}>
          <CommandInput placeholder="Search..." />
            <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check className={cn("mr-2 h-4 w-4",
                      selected.includes(option.value) ? "opacity-100" : "opacity-0")
                    } />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
