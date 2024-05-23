import { forwardRef } from 'react'

// react-colorful
import { HexColorPicker } from 'react-colorful'

// shadcn
import { Button, ButtonProps } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// utils
import { cn } from '@/lib/utils'

type ColorPickerProps = {
  value: string
  onChange: React.Dispatch<React.SetStateAction<string>>
} & Omit<ButtonProps, 'value' | 'onChange'>

const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(({
  value, onChange,
  className, size = 'icon', style = { backgroundColor: value }, ...props
}, ref) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn("w-8 h-8 rounded-md border-[3px] border-border shadow-md cursor-pointer", className)}
          size={size}
          style={style}
          ref={ref}
          {...props}
        />
      </PopoverTrigger>
      <PopoverContent>
        <HexColorPicker
          color={value}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  )
})

export default ColorPicker
