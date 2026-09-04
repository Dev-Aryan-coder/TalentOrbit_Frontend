import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroupContext = React.createContext(null)

export const RadioGroup = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} className={cn("grid gap-2", className)} role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = "RadioGroup"

export const RadioGroupItem = React.forwardRef(({ className, value, isSelected, onClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="radio"
      aria-checked={isSelected}
      onClick={onClick}
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-300 transition-all focus:outline-none dark:border-slate-600",
        isSelected && "border-[#0055ff] bg-[#0055ff] text-white shadow-sm",
        className
      )}
      {...props}
    >
      {isSelected && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export default RadioGroup
