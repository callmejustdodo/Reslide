import type { ReactNode } from "react"
import { cn } from "@/registry/new-york/utils/cn"

interface SubtitleProps {
  children: ReactNode
  className?: string
}

export function Subtitle({ children, className }: SubtitleProps) {
  return (
    <h2
      className={cn(
        "text-4xl font-medium font-heading text-rs-text-secondary leading-snug m-0",
        className,
      )}
    >
      {children}
    </h2>
  )
}
