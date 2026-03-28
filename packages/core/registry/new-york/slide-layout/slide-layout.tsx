import type { ReactNode } from "react"
import { cn } from "@/registry/new-york/utils/cn"

interface LayoutProps {
  children: ReactNode
  className?: string
}

function Center({ children, className }: LayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full p-16 gap-6 text-center",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Default({ children, className }: LayoutProps) {
  return (
    <div className={cn("flex flex-col w-full h-full p-16 gap-6", className)}>
      {children}
    </div>
  )
}

interface TwoColumnProps extends LayoutProps {
  sizes?: [number, number]
  gap?: string
}

function TwoColumn({
  children,
  className,
  sizes = [1, 1],
  gap = "2rem",
}: TwoColumnProps) {
  return (
    <div
      className={cn("grid w-full h-full p-16", className)}
      style={{
        gridTemplateColumns: `${sizes[0]}fr ${sizes[1]}fr`,
        gap,
      }}
    >
      {children}
    </div>
  )
}

function Section({ children, className }: LayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full p-16 text-center",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Blank({ children, className }: LayoutProps) {
  return (
    <div className={cn("w-full h-full relative", className)}>{children}</div>
  )
}

export const SlideLayout = {
  Center,
  Default,
  TwoColumn,
  Section,
  Blank,
}
