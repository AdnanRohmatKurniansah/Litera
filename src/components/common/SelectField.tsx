import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface SelectFieldProps {
  label: string
  value: string
  onChange: (id: string, name: string) => void
  options: { id: string; name: string }[]
  placeholder: string
  disabled?: boolean
  error?: string
}

const SelectField = ({ label, value, onChange, options, placeholder, disabled, error }: SelectFieldProps) => (
  <div className="w-full">
    <Label className="mb-2 block">{label}</Label>
    <Select
      value={value}
      onValueChange={(id) => {
        const selected = options.find((o) => o.id === id)
        onChange(id, selected?.name ?? "")
      }}
      disabled={disabled || options.length === 0}
    >
      <SelectTrigger className={`w-full ${error ? "border-destructive" : ""}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="text-destructive text-xs mt-1">{error}</p>}
  </div>
)

export default SelectField