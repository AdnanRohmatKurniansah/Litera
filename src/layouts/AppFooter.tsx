import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  description?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
  mobileApp?: {
    title?: string;
    description?: string;
    appStoreUrl?: string;
    googlePlayUrl?: string;
  };
}

const Footer = ({
  logo = {
    src: "/images/logo/logo.png",
    alt: "logo",
    url: "/",
  },
  description = "Discover your next great adventure with us. From hidden gems to iconic destinations, we're here to make your travel dreams easy, memorable, and worry-free.",
  menuItems = [
    {
      title: "Navigation",
      links: [
        { text: "Home", url: "/" },
        { text: "About Us", url: "/about-us" },
        { text: "Articles", url: "/articles" },
        { text: "Contact Us", url: "/contact-us" },
      ],
    },
    {
      title: "Other Links",
      links: [
        { text: "Promo", url: "/promo" },
        { text: "Terms & Conditions", url: "/terms-conditions" },
        { text: "Privacy Policy", url: "/privacy-policy" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} ARK. All rights reserved.`,
  mobileApp = {
    title: "Our Mobile App",
    description: "Download our app which is available on all iOS and Android devices",
    appStoreUrl: "#",
    googlePlayUrl: "#",
  },
}: FooterProps) => {

  return (
    <section className="pt-20 pb-3 md:pb-5 mt-5 md:mt-10 px-5 md:px-32 bg-[#F3F6F9]">
      <div className="container mx-auto">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-7">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Link to={logo.url} className="shrink-0">
                  <img src={logo.src} width={0} height={0} sizes="100vw" className="h-16 w-auto" alt={logo.alt} />
                </Link>
              </div>
              <p className="mt-4 text-gray-700 font-normal text-[15px] md:text-[16px] mb-5">{description}</p>
              <ul className="social-media flex gap-2">
                <li className="w-9 h-9 flex items-center justify-center bg-primary rounded-full border border-primary text-white transition-all">
                  <Link className="group" to={'#'}>
                    <Facebook className="w-5 h-5" />
                  </Link>
                </li>
                <li className="w-9 h-9 flex items-center justify-center bg-primary rounded-full border border-primary text-white transition-all">
                  <Link className="group" to={'#'}>
                    <Instagram className="w-5 h-5" />
                  </Link>
                </li>
                <li className="w-9 h-9 flex items-center justify-center bg-primary rounded-full border border-primary text-white transition-all">
                  <Link className="group" to={'#'}>
                    <Youtube className="w-5 h-5" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="hidden md:block"></div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 relative font-bold flex items-center">
                  <span className="z-2">{section.title}</span>
                </h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="text-gray-700 hover:text-primary text-[15px] md:text-[16px]"
                    >
                      <Link className="group" to={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 lg:col-span-2 mt-5 md:mt-0">
              <h3 className="mb-2 font-bold text-left md:text-right">{mobileApp.title}</h3>
              <p className="text-gray-700 text-sm mb-4 text-left md:text-right">{mobileApp.description}</p>
              <div className="flex gap-3 justify-start md:justify-end">
                <Link to={mobileApp.appStoreUrl ?? "#"}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] text-gray-300">Download on the</span>
                    <span className="text-sm font-semibold">App Store</span>
                  </div>
                </Link>
                <Link to={mobileApp.googlePlayUrl ?? "#"} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors" >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.18 23.76c.3.16.63.24.97.24.48 0 .96-.15 1.37-.44l11.5-6.64-2.87-2.87L3.18 23.76zM.5 1.5C.19 1.93 0 2.47 0 3.07v17.86c0 .6.19 1.14.5 1.57l.08.08 10-10v-.23L.58 1.42.5 1.5zM20.46 10.37l-2.78-1.6-3.18 3.18 3.18 3.18 2.8-1.62c.8-.46.8-1.21-.02-1.14z" fill="#EA4335"/>
                    <path d="M3.18 23.76c.3.16.63.24.97.24.48 0 .96-.15 1.37-.44l11.5-6.64-2.87-2.87L3.18 23.76z" fill="#FBBC05"/>
                    <path d="M20.46 10.37l-2.78-1.6-3.18 3.18 3.18 3.18 2.8-1.62c.8-.46.8-1.21-.02-1.14z" fill="#4285F4"/>
                    <path d="M.5 1.5C.19 1.93 0 2.47 0 3.07v17.86c0 .6.19 1.14.5 1.57l.08.08 10-10v-.23L.58 1.42.5 1.5z" fill="#34A853"/>
                    <path d="M3.52.44L15.02 7.08l-2.87 2.87L1.18.68C1.59.39 2.07.24 2.55.24c.34 0 .67.07.97.2z" fill="#EA4335"/>
                  </svg>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] text-gray-300">GET IT ON</span>
                    <span className="text-sm font-semibold">Google Play</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t pt-3 md:pt-8">
            <div className="flex flex-col text-center justify-center gap-4 text-[11px] md:text-[13px] text-gray-700 md:items-center">
              <p>{copyright}</p>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };