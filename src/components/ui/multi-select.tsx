
import * as React from 'react'
import { cn } from "@/lib/utils"

import { Check, X, ChevronsUpDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandProps } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type OptionType = {
  label: string
  value: string
}

interface MultiSelectProps extends Omit<CommandProps, 'onChange'> {
  options: OptionType[]
  selected: string[]
  onChange: React.Dispatch<React.SetStateAction<string[]>>
  disabled?: boolean
}

function MultiSelect({ options, selected, onChange, disabled, ...props }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: OptionType) => {
    onChange(
      selected.includes(option.value)
        ? selected.filter((item) => item !== option.value)
        : [...selected, option.value]
    )
    setOpen(true)
  }

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  const getLabel = (value: string): string => {
    const option = options.find((option) => option.value === value)
    return option?.label || 'asd'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full h-fit justify-between"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          onClick={() => setOpen((open) => !open)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-x-2 gap-y-1.5">
            {selected.length ? selected.map((item) => (
              <Badge className="px-2.5 py-0.5 icon-wrapper"
                variant="secondary"
                size="sm"
                key={item}
                onClick={() => handleUnselect(item)}
              >
                <span>{getLabel(item)}</span>
                <a className="border ring-offset-background rounded-full outline-none hover:ring-2 hover:ring-destructive hover:ring-offset focus:ring-2 focus:ring-destructive focus:ring-offset"
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
                  <X className="text-muted-foreground hover:text-destructive focus:text-destructive"
                    size={14}
                  />
                </a>
              </Badge>
            )) : (
              <span className="text-muted-foreground">
                Select from available options...
              </span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <Command {...props}>
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
