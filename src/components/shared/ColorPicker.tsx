// shadcn
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// react-colorful
import { HexColorPicker } from 'react-colorful'

type ColorPickerProps = {
  color: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="w-8 h-8 rounded-md border-[3px] border-border shadow-md cursor-pointer"
          style={{ backgroundColor: color }}
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
