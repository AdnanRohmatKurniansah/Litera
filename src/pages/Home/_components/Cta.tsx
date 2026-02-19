import { Link } from "react-router"

const Cta = () => {
  return (
    <div className="relative w-full px-5 md:px-32 pb-10 md:pb-20">
      <div className="container mx-auto">
        <Link to="#">
          <div className="relative w-full aspect-auto md:aspect-[20/4] rounded-2xl overflow-hidden">
            <img
              src="/images/cta/ctaimage.png"
              alt="Start Your Reading Journey Today"
              className="w-full h-full"
            />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Cta