// components/stat-card.tsx
import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react" // type helper [web:3]

type StatCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between px-6 py-4 rounded-xl h-full">
      <div className="flex flex-col">
        <span className="text-xs font-medium">
          {label}
        </span>
        <span className="mt-1  font-semibold">
          {value}
        </span>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
        <Icon className="h-5 w-5 " />
      </div>
    </Card>
  )
}
