import { useBookRating, useBookReview, useMyReview, useReviewCreate, useBooksUpdate, useBooksDelete } from "@/api/queries/review"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import type { Review, User } from "@/types"
import { AxiosError } from "axios"
import { Pencil, Star, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { formatDate, stripHtml } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router"
import { ReviewSkeleton } from "./BookReviewSkeleton"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { CreateReviewSchema, UpdateReviewSchema, type CreateReviewType, type UpdateReviewType } from "@/lib/schema/review.schema"

interface Props {
  bookId: string
  user: User | null
}

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

const PREVIEW_COUNT = 5

const BookReview = ({ bookId, user }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: reviewData, isLoading: reviewLoading } = useBookReview(bookId)
  const { data: ratingData } = useBookRating(bookId)
  const { data: myReviews } = useMyReview(!!user)

  const createReview = useReviewCreate()
  const updateReview = useBooksUpdate()
  const deleteReview = useBooksDelete()

  const reviews: Review[] = reviewData?.data?.data ?? reviewData?.data ?? []

  const avgRatingFromReviews =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length
      : 0

  const avgRating: number = ratingData?.data?.averageRating ?? avgRatingFromReviews
  const totalReviews: number = ratingData?.data?.totalReviews ?? reviews.length

  const myReview: Review = myReviews?.data?.find((r: Review) => r.bookId === bookId)
  const alreadyReviewed = !!myReview

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    setValue: setCreateValue,
    watch: watchCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateReviewType>({
    resolver: zodResolver(CreateReviewSchema),
    defaultValues: { bookId, rating: 5, comment: "" },
  })

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setEditValue,
    watch: watchEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<UpdateReviewType>({
    resolver: zodResolver(UpdateReviewSchema),
    defaultValues: { rating: 5, comment: "" },
  })

  const createRating = watchCreate("rating")
  const editRating = watchEdit("rating")

  const invalidateReviews = () => {
    queryClient.invalidateQueries({ queryKey: ["book-review", bookId] })
    queryClient.invalidateQueries({ queryKey: ["book-rating", bookId] })
    queryClient.invalidateQueries({ queryKey: ["my-review"] })
  }

  const handleSubmit = async (values: CreateReviewType) => {
    await createReview.mutateAsync(values, {
      onSuccess: (res) => {
        toast.success(res.message)
        resetCreate({ bookId, rating: 5, comment: "" })
        setDialogOpen(false)
        invalidateReviews()
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
      },
    })
  }

  const handleEditStart = (review: Review) => {
    setEditId(review.id)
    resetEdit({ rating: review.rating, comment: review.comment ?? "" })
    setEditDialogOpen(true)
  }

  const handleEditSave = async (values: UpdateReviewType) => {
    if (!editId) return
    await updateReview.mutateAsync({ id: editId, payload: values }, {
      onSuccess: (res) => {
        toast.success(res.message)
        setEditDialogOpen(false)
        invalidateReviews()
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
      },
    })
  }

  const handleWriteReview = () => {
    if (!user) {
      toast.error("Please login first")
      navigate("/login")
      return
    }
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteReview.mutateAsync(id, {
      onSuccess: (res) => {
        toast.success(res.message)
        invalidateReviews()
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
      },
    })
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT)

  return (
    <div className="review mt-6 md:mt-10">
      <div className="flex items-center justify-between mb-5">
        <h6 className="font-bold text-xl md:text-2xl tracking-wide">Product Reviews</h6>
      </div>

      <div className="border-b pb-5 flex flex-row sm:items-center gap-4 mb-8 p-4 items-center">
        <div className="flex items-center gap-3 shrink-0">
          <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold leading-none">{avgRating > 0 ? avgRating.toFixed(1) : "0.0"}</span>
            <span className="text-sm text-muted-foreground">/5</span>
          </div>
          <Separator orientation="vertical" className="h-8 hidden sm:block" />
          <div className="hidden sm:block text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalReviews}</span> Review
          </div>
        </div>
        <div className="sm:hidden text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalReviews}</span> Review
        </div>
        <div className="sm:ml-auto flex flex-col sm:flex-row sm:items-center gap-4">
          {user && !alreadyReviewed && (
            <>
              <p className="text-sm text-muted-foreground hidden sm:block">What do you think about this product?</p>
              <Button variant="outline" size="sm" onClick={handleWriteReview} className="shrink-0">
                Write Review
              </Button>
            </>
          )}
          {!user && (
            <Button variant="outline" size="sm" onClick={handleWriteReview} className="shrink-0">
              Write Review
            </Button>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate(handleSubmit)} className="space-y-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your rating</p>
              <StarRating value={createRating} onChange={(val) => setCreateValue("rating", val, { shouldValidate: true })} />
              {createErrors.rating && (
                <p className="text-xs text-destructive mt-1">{createErrors.rating.message}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your review</p>
              <Textarea
                placeholder="Share your experience with this book..."
                rows={6}
                className="h-32"
                {...registerCreate("comment")}
              />
              {createErrors.comment && (
                <p className="text-xs text-destructive mt-1">{createErrors.comment.message}</p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createReview.isPending}>
                {createReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(handleEditSave)} className="space-y-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your rating</p>
              <StarRating value={editRating ?? 5} onChange={(val) => setEditValue("rating", val, { shouldValidate: true })} />
              {editErrors.rating && (
                <p className="text-xs text-destructive mt-1">{editErrors.rating.message}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your review</p>
              <Textarea rows={4} {...registerEdit("comment")} />
              {editErrors.comment && (
                <p className="text-xs text-destructive mt-1">{editErrors.comment.message}</p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateReview.isPending}>
                {updateReview.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {reviewLoading ? (
        <ReviewSkeleton />
      ) : reviews.length === 0 ? (
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center py-10">
          <img className="w-[140px] h-[140px] object-contain" src="/images/review-empty.png" alt="No reviews" />
          <div className="text-center sm:text-left">
            <h5 className="text-base font-bold text-gray-800 mb-1">No reviews yet</h5>
            <p className="text-sm text-gray-500 mb-4">Be the first to leave a review!</p>
            {!alreadyReviewed && (
              <Button variant="outline" onClick={handleWriteReview}>
                Write Review
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="divide-y">
            {displayedReviews.map((review: Review) => {
              const isOwner = user?.id === review.userId
              return (
                <div key={review.id} className="py-4 first:pt-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-7 md:w-9 h-7 md:h-9 shrink-0">
                      <AvatarImage src={review.user?.profile} />
                      <AvatarFallback>
                        {review.user?.name?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[12px] md:text-sm font-semibold leading-tight">
                            {review.user?.name ? stripHtml(review.user?.name).slice(0, 30) + "..." : "-"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                          <StarRating value={review.rating} readonly size="sm" />
                          {isOwner && (
                            <div className="hidden md:flex mt-2 md:mt-0 justify-end gap-0.5 ml-1">
                              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleEditStart(review)}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => handleDelete(review.id)} disabled={deleteReview.isPending}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-[12px] md:text-sm text-muted-foreground mt-1 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex md:hidden justify-end gap-0.5 ml-1">
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleEditStart(review)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => handleDelete(review.id)} disabled={deleteReview.isPending}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {reviews.length > PREVIEW_COUNT && (
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="text-sm font-medium text-foreground hover:underline flex items-center gap-1" >
                {showAll ? "See Less ∧" : "See More ∨"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BookReview