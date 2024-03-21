// shadcn
import { Input, InputProps } from "@/components/ui/input"
import { forwardRef } from "react"

type FileInputProps = {
  setFileContent: React.Dispatch<React.SetStateAction<string | null>>
} & InputProps

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(({ setFileContent, ...props }, ref) => {
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      setFileContent(null)
      return
    }
    
    const reader = new FileReader()
    reader.readAsText(selectedFile)
    reader.onload = (e) => {
      const content = e.target?.result
      setFileContent(content as string)
    }
  }

  return (
    <Input type="file"
      onChange={handleSelect}
      ref={ref}
      {...props}
    />
  )
})

export default FileInput