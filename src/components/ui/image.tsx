
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, alt, ...props }, ref) => {
    return (
      <img
        className={cn(className)}
        ref={ref}
        alt={alt}
        {...props}
      />
    )
  }
)

Image.displayName = "Image"

export { Image }
