import { useEffect } from "react"

interface MetaProps {
  title?: string
  description?: string
  keywords?: string
}

const DEFAULT_DESCRIPTION =
  "Litera is a trusted online bookstore in Indonesia offering a wide selection of educational books, novels, children's books, reference materials, and the latest releases at affordable prices. Enjoy easy book shopping with fast delivery, secure payment methods, and responsive customer support.";

const DEFAULT_KEYWORDS =
  "litera, bookstore, online bookstore, book store indonesia, online book shop, educational books, children's books, novels, reference books, school books, college books, business books, religious books, fiction books, non-fiction books, new books, affordable books, buy books online, books indonesia";

export const PageMetadata = ({
  title,
  description,
  keywords,
}: MetaProps) => {
  useEffect(() => {
    if (title) {
      document.title = title
    }

    const setMeta = (name: string, content?: string) => {
      if (!content) return

      let element = document.querySelector(`meta[name="${name}"]`)
      if (!element) {
        element = document.createElement("meta")
        element.setAttribute("name", name)
        document.head.appendChild(element)
      }
      element.setAttribute("content", content)
    }

    setMeta("description", DEFAULT_DESCRIPTION)
    setMeta("keywords", DEFAULT_KEYWORDS)
  }, [title, description, keywords])
}