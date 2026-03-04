import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

const QtyControl = ({ qty, onIncrease, onDecrease, disabled }: { qty: number, onIncrease: () => void, onDecrease: () => void, disabled?: boolean }) => (
  <div className="flex items-center border rounded-md overflow-hidden">
    <Button
      size={'xs'}
      variant={'ghost'}
      onClick={onDecrease}
      disabled={disabled || qty <= 1}>
      <Minus className="w-3.5 h-3.5" />
    </Button>
    <span className="px-3 py-1.5 text-xs font-medium min-w-[32px] text-center border-x">
      {qty}
    </span>
    <Button variant={'ghost'} size={'xs'} onClick={onIncrease} disabled={disabled}>
      <Plus className="w-3.5 h-3.5" />
    </Button>
  </div>
)

export default QtyControl