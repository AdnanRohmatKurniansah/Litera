import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PageMetadata } from "@/components/common/PageMetadata"
import NavigationSide from "../_components/NavSide"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useMyReview, useBooksUpdate, useBooksDelete } from "@/api/queries/review"
import type { Review } from "@/types"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Menu, Pencil, Star, Trash2 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/UserContext"
import { useNavigate } from "react-router"
import { formatDate } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { UpdateReviewSchema, type UpdateReviewType } from "@/lib/schema/review.schema"

const StarRating = ({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number
  onChange?: (val: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}) => {
  const sizeClass = size === "lg" ? "w-7 h-7" : size === "sm" ? "w-4 h-4" : "w-5 h-5"
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} transition-colors ${
            star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } ${!readonly ? "cursor-pointer hover:fill-yellow-300 hover:text-yellow-300" : ""}`}
          onClick={() => !readonly && onChange?.(star)}
        />
      ))}
    </div>
  )
}

const ReviewCardSkeleton = () => (
  <div className="border border-gray-200 rounded-md p-4 flex gap-4 animate-pulse">
    <div className="w-[60px] h-[80px] bg-gray-200 rounded shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 w-1/3" />
      <div className="h-3 bg-gray-200 w-1/4" />
      <div className="h-4 bg-gray-200 w-24" />
      <div className="h-3 bg-gray-200 w-2/3" />
    </div>
  </div>
)

const MyReviewPage = () => {
  PageMetadata({ title: "My Reviews | Litera" })

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const { data, isLoading } = useMyReview(isAuthenticated)
  const updateReview = useBooksUpdate()
  const deleteReview = useBooksDelete()

  const reviews: Review[] = data?.data ?? data ?? []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateReviewType>({
    resolver: zodResolver(UpdateReviewSchema),
    defaultValues: { rating: 5, comment: "" },
  })

  const editRating = watch("rating")

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["my-review"] })
  }

  const handleEditStart = (review: Review) => {
    setEditId(review.id)
    reset({ rating: review.rating, comment: review.comment ?? "" })
    setEditDialogOpen(true)
  }

  const handleEditSave = async (values: UpdateReviewType) => {
    if (!editId) return
    await updateReview.mutateAsync(
      { id: editId, payload: values },
      {
        onSuccess: (res) => {
          toast.success(res.message)
          setEditDialogOpen(false)
          invalidate()
        },
        onError: (error) => {
          toast.error(
            error instanceof AxiosError
              ? error.response?.data?.message ?? "Failed to update review"
              : "Something went wrong"
          )
        },
      }
    )
  }

  const handleDelete = async (id: string) => {
    await deleteReview.mutateAsync(id, {
      onSuccess: (res) => {
        toast.success(res.message)
        invalidate()
      },
      onError: (error) => {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.message ?? "Failed to delete review"
            : "Something went wrong"
        )
      },
    })
  }

  return (
    <section className="books-detail">
      <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
        <div className="container mx-auto">
          <Breadcrumb className="pb-5 md:pb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Reviews</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-3 mb-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="text-[12px] flex items-center gap-2">
                  <Menu className="w-3 h-3" />
                  Navigation
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b mt-3">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <NavigationSide />
              </SheetContent>
            </Sheet>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="nav-side relative md:sticky md:top-28 h-fit col-span-4 md:col-span-1 hidden md:block">
              <NavigationSide />
            </div>
            <div className="col-span-4 md:col-span-3 mb-8">
              <div className="p-5 border border-gray-200 rounded-md">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">Product Reviews</h4>
                  <p className="text-sm text-gray-500">View and manage the reviews you have provided.</p>
                </div>
                <Separator className="mb-5" />
                {isLoading ? (
                  <div className="space-y-3">
                    <ReviewCardSkeleton />
                    <ReviewCardSkeleton />
                    <ReviewCardSkeleton />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <img className="mx-auto w-[100px] md:w-[160px] h-[100px] md:h-[160px]" src="/images/review-empty.png" alt="empty data"/>
                    <h5 className="text-base font-semibold text-gray-800 mb-1">
                      No reviews yet
                    </h5>
                    <p className="text-sm text-gray-500 max-w-sm mb-4">
                      You have not provided a review for any product.
                    </p>
                    <Button size="sm" onClick={() => navigate("/books")}>
                      Explore Books
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review: Review) => (
                      <div key={review.id} className="border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row gap-4">
                        <div className="shrink-0 cursor-pointer"  onClick={() => review.book?.slug && navigate(`/books/${review.book.slug}`)}>
                          <img src={review.book?.image_url} alt={review.book?.name ?? "Book"} className="w-[60px] h-[80px] object-cover rounded shadow-sm"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(review.created_at)}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-gray-800 truncate cursor-pointer hover:underline"
                                onClick={() =>
                                  review.book?.slug && navigate(`/books/${review.book.slug}`)
                                }>
                                {review.book?.name ?? "-"}
                              </p>
                              <StarRating value={review.rating} readonly size="sm" />
                              {review.comment && (
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <Button variant="ghost" size="sm" className="text-xs gap-1 h-8 px-2" onClick={() => handleEditStart(review)}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(review.id)}
                                disabled={deleteReview.isPending}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditSave)} className="space-y-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your rating</p>
              <StarRating
                value={editRating ?? 5}
                onChange={(val) => setValue("rating", val, { shouldValidate: true })}
              />
              {errors.rating && (
                <p className="text-xs text-destructive mt-1">{errors.rating.message}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your Review</p>
              <Textarea rows={4} {...register("comment")} />
              {errors.comment && (
                <p className="text-xs text-destructive mt-1">{errors.comment.message}</p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateReview.isPending}>
                {updateReview.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default MyReviewPage