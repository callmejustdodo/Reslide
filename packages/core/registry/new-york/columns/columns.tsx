import type { ReactNode } from "react"
import { cn } from "@/registry/new-york/utils/cn"

interface ColumnsProps {
  children: ReactNode
  sizes?: number[]
  gap?: string
  className?: string
}

export function Columns({
  children,
  sizes = [1, 1],
  gap = "2rem",
  className,
}: ColumnsProps) {
  return (
    <div
      className={cn("grid w-full h-full", className)}
      style={{
        gridTemplateColumns: sizes.map((s) => `${s}fr`).join(" "),
        gap,
      }}
    >
      {children}
    </div>
  )
}
