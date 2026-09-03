import * as React from "react"
import { cn } from "@/lib/utils"

export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-semibold tracking-wide text-slate-700 uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))

Label.displayName = "Label"
export default Label
