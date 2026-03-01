import { Textarea } from "@/components/ui/textarea";
import { SectionCard, SectionHeader } from "./CheckoutCard";

const CheckoutNote = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <SectionCard>
    <SectionHeader>Note (optional)</SectionHeader>
    <div className="p-5">
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Example: Please pack it nicely."
        className="resize-none text-sm"
        rows={3}
      />
    </div>
  </SectionCard>
)

export default CheckoutNote