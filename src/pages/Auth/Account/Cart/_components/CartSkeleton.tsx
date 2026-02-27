const CartSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="border rounded-lg p-4 flex gap-4 animate-pulse">
        <div className="w-5 h-5 bg-gray-200 rounded mt-1 shrink-0" />
        <div className="w-20 h-24 bg-gray-200 rounded-md shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 w-1/2" />
          <div className="h-3 bg-gray-200 w-1/4" />
          <div className="h-5 bg-gray-200  w-1/3" />
          <div className="flex gap-2 mt-3">
            <div className="h-8 bg-gray-200 w-24" />
            <div className="h-8 bg-gray-200 w-8" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default CartSkeleton