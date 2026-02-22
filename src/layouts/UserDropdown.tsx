import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronRight } from 'lucide-react';
import { Link, useNavigate } from "react-router"
import type { User as UserData } from "@/types"
import { useLogout } from "@/api/queries/auth"
import { toast } from "sonner"

interface Props {
  user: UserData
}

const UserDropdown = ({ user }: Props) => {
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/")
      },
      onError: () => {
        toast.error("Failed to logout")
      },
    })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary/40 transition-all duration-200 shrink-0">
          <img  src={user.profile || "/images/default-avatar.png"} alt="User Avatar" className="h-full w-full object-cover" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10}
        className="w-60  rounded-xl shadow-xl border p-3 animate-in fade-in zoom-in-95">
        <div className="px-2 py-2">
          <p className="text-sm font-semibold truncate">
            {user.name}
          </p>
          {user.email && (
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/account" className="flex justify-between items-center gap-2 rounded-md px-2 py-2 hover:bg-muted transition" >
            <span>Account</span>
            <ChevronRight />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/account/wishlist" className="flex justify-between items-center gap-2 rounded-md px-2 py-2 hover:bg-muted transition" >
            <span>Transaction</span>
            <ChevronRight />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/account/wishlist" className="flex justify-between items-center gap-2 rounded-md px-2 py-2 hover:bg-muted transition" >
            <span>Wishlist</span>
            <ChevronRight />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem disabled={logoutMutation.isPending} onClick={handleLogout} className="flex justify-between items-center gap-2 rounded-md px-2 py-2  hover:bg-red-50 cursor-pointer transition">
          <span>Logout</span>
          <ChevronRight />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown