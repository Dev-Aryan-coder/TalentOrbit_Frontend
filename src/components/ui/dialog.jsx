import * as React from "react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext({
  open: false,
  onOpenChange: () => {},
})

export const Dialog = ({ children, open, onOpenChange, defaultOpen = false }) => {
  const [isOpenState, setIsOpenState] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : isOpenState

  const handleOpenChange = React.useCallback(
    (value) => {
      if (!isControlled) {
        setIsOpenState(value)
      }
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export const DialogTrigger = React.forwardRef(({ className, children, onClick, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)
  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      onClick={(e) => {
        onClick?.(e)
        onOpenChange(true)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
DialogTrigger.displayName = "DialogTrigger"

export const DialogPortal = ({ children }) => {
  return children
}

export const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(DialogContext)
  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in-0",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
})
DialogOverlay.displayName = "DialogOverlay"

export const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(DialogContext)
  if (!open) return null

  return (
    <>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 transition-all animate-in fade-in-0 zoom-in-95 dark:bg-slate-950 dark:border-slate-800",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </div>
    </>
  )
})
DialogContent.displayName = "DialogContent"

export const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-800", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

export const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 p-5 border-t border-slate-100 dark:border-slate-800",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

export const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

export const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export const DialogClose = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        onOpenChange(false)
      }}
      aria-label="Close"
      {...props}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
})
DialogClose.displayName = "DialogClose"

export default Dialog
