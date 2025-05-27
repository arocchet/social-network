import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface DockProps {
    className?: string
    items: {
        icon: LucideIcon
        label: string
        onClick?: () => void
    }[]
}

interface DockIconButtonProps {
    icon: LucideIcon
    label: string
    onClick?: () => void
    className?: string
}



const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
    ({ icon: Icon, label, className, onClick }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                className={cn(
                    "relative group p-3 rounded-lg",
                    "hover:bg-neutral-800 transition-colors",
                    className
                )}
                type="button"
            >
                <Icon className="w-5 h-5 text-primary" />
                <span className={cn(
                    "absolute -top-8 left-1/2 -translate-x-1/2",
                    "px-2 py-1 rounded text-xs",
                    "bg-popover text-popover-foreground",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity whitespace-nowrap pointer-events-none"
                )}>
                    {label}
                </span>
            </motion.button>
        )
    }
)
DockIconButton.displayName = "DockIconButton"

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
    ({ items, className }, ref) => {
        return (
            <div ref={ref} className={cn("w-full flex items-center justify-center p-2", className)}>
                <div className=" max-w-4xl gap-4 h-14 px-10 rounded-2xl flex items-center justify-center relative bg-[var(--bgLevel1)] border-1 border-[var(--detailMinimal)]">
                    {items.map((item) => (
                        <DockIconButton key={item.label} {...item} />
                    ))}
                </div>
            </div>
        )
    }
)
Dock.displayName = "Dock"

export { Dock }