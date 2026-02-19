import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import type { Category } from "@/types"

const LANGUAGES = ["Indonesia", "English", "Arabic", "Japanese", "Korean"]

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Price: High to Low", value: "price_high" },
  { label: "Name: A–Z", value: "name_asc" },
  { label: "Name: Z–A", value: "name_desc" },
]

const MAX_PRICE = 10_000_000

type Props = {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (val: string) => void
  selectedLanguage: string
  setSelectedLanguage: (val: string) => void
  priceRange: number[]
  setPriceRange: (val: number[]) => void
  sortBy: string
  setSortBy: (val: string) => void
}

const FilterBook = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedLanguage,
  setSelectedLanguage,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
}: Props) => {
  return (
    <Accordion
      type="multiple"
      defaultValue={["sort", "category", "language", "price"]}
      className="w-full space-y-2">
      <AccordionItem value="sort">
        <AccordionTrigger className="text-sm font-medium">Sort By</AccordionTrigger>
        <AccordionContent className="pt-2">
          <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2">
            {SORT_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`sort-${opt.value}`} />
                <Label htmlFor={`sort-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="category">
        <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
        <AccordionContent className="pt-2">
          <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" />
              <Label htmlFor="cat-all">All</Label>
            </div>
            {categories.map((cat) => (
              <div key={cat.slug} className="flex items-center space-x-2">
                <RadioGroupItem value={cat.slug} id={`cat-${cat.slug}`} />
                <Label htmlFor={`cat-${cat.slug}`}>{cat.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="language">
        <AccordionTrigger className="text-sm font-medium">Language</AccordionTrigger>
        <AccordionContent className="pt-2">
          <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="lang-all" />
              <Label htmlFor="lang-all">All</Label>
            </div>
            {LANGUAGES.map((lang) => (
              <div key={lang} className="flex items-center space-x-2">
                <RadioGroupItem value={lang} id={`lang-${lang}`} />
                <Label htmlFor={`lang-${lang}`}>{lang}</Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="price">
        <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
        <AccordionContent className="pt-4">
          <Slider
            min={0}
            max={MAX_PRICE}
            step={100_000}
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="text-sm text-muted-foreground mt-2">
            Rp {priceRange[0].toLocaleString("id-ID")} – Rp {MAX_PRICE.toLocaleString("id-ID")}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default FilterBook