export const SectionCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`border rounded-lg bg-white overflow-hidden ${className}`}>{children}</div>
)

export const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-5 py-4 border-b bg-gray-50">
    <h3 className="font-semibold text-sm text-gray-700">{children}</h3>
  </div>
)