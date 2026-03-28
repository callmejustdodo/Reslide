import type { ReactNode } from "react"
import { cn } from "@/registry/new-york/utils/cn"

interface BodyProps {
  children: ReactNode
  className?: string
}

export function Body({ children, className }: BodyProps) {
  return (
    <p
      className={cn(
        "text-[1.75rem] font-body text-rs-text-secondary leading-relaxed m-0",
        className,
      )}
    >
      {children}
    </p>
  )
}
