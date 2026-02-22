import { useLogout } from '@/api/queries/auth'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/UserContext'
import { ChevronRight } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'

const menu = [
  {
    label: 'Account Information',
    url: '/account',
  },
  {
    label: 'Transactions',
    url: '/account/transactions',
  },
  {
    label: 'Wishlist',
    url: '/account/wishlist',
  },
  {
    label: 'Change Password',
    url: '/account/change-password',
    emailOnly: true,
  }
]

const NavigationSide = () => {
  const { pathname } = useLocation()
  const { user, emailMethod, isInitialized } = useAuth()
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/"),
      onError: () => toast.error("Failed to logout"),
    })
  }

  return (
    <div className="border rounded-md p-4 mb-10 md:mb-4">
      {/* User Info */}
      {!isInitialized ? (
        <div className="flex items-center gap-3 pb-4 border-b mb-6 animate-pulse">
          <div className="w-12 h-12 rounded-full shrink-0 bg-gray-200" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 bg-gray-200" />
            <div className="h-3 w-full bg-gray-200" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 pb-4 border-b mb-6">
          <img
            src={user?.profile || "/images/default-avatar.png"}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {menu
          .filter(item => !item.emailOnly || emailMethod)
          .map((item) => {
            const isActive = pathname === item.url
            return (
              <Button
                key={item.url}
                className={`w-full justify-start text-gray-700 hover:text-gray-700 ${
                  isActive ? 'font-bold bg-muted' : 'font-normal'
                }`}
                variant="ghost"
                asChild
              >
                <Link to={item.url} className="flex items-center w-full">
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto w-4 h-4" />
                </Link>
              </Button>
            )
          })}

        <Button
          className="w-full justify-start text-destructive hover:text-destructive font-normal"
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
          <ChevronRight className="ml-auto w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default NavigationSide