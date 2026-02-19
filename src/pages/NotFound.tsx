import { Link } from "react-router"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-6">
      <div className="text-center max-w-xl">
        <img className="mx-auto" width={240} height={240} src={'/images/empty.png'} alt="empty data" />
        <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-3 text-gray-500 text-sm md:text-base">
          The page you are looking for doesn’t exist or has been moved.
          Please check the URL or return to the homepage.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="px-6 py-5 text-base">
            <Link to="/">
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" className="px-6 py-5 text-base border-primary text-primary " onClick={() => window.history.back()} >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound