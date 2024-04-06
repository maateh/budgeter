// react-colorful
import { HexColorPicker } from 'react-colorful'

// shadcn
import { Button, ButtonProps } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// utils
import { cn } from '@/lib/utils'

type ColorPickerProps = {
  color: string
  onChange: React.Dispatch<React.SetStateAction<string>>
} & ButtonProps

const ColorPicker = ({
  color, onChange,
  className, size = 'icon', style = { backgroundColor: color }, ...props
}: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn("w-8 h-8 rounded-md border-[3px] border-border shadow-md cursor-pointer", className)}
          size={size}
          style={style}
          {...props}
        />
      </PopoverTrigger>
      <PopoverContent>
        <HexColorPicker
          color={color}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker
