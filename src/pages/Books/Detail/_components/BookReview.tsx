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
import { formatDate } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router"
import { ReviewSkeleton } from "./BookReviewSkeleton"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateReviewSchema, UpdateReviewSchema, type CreateReviewType, type UpdateReviewType } from "@/lib/schema/review.schema"

interface Props {
  bookId: string
  user: User | null
}

const StarRating = ({
  value,
  onChange,
  readonly = false,
}: {
  value: number
  onChange?: (val: number) => void
  readonly?: boolean
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 transition-colors ${
          star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        } ${!readonly ? "cursor-pointer hover:fill-yellow-300 hover:text-yellow-300" : ""}`}
        onClick={() => !readonly && onChange?.(star)}
      />
    ))}
  </div>
)

const BookReview = ({ bookId, user }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const navigate = useNavigate()

  const { data: reviewData, isLoading: reviewLoading } = useBookReview(bookId)
  const { data: ratingData } = useBookRating(bookId)
  const { data: myReviews } = useMyReview(!!user)

  const createReview = useReviewCreate()
  const updateReview = useBooksUpdate()
  const deleteReview = useBooksDelete()

  const reviews: Review[] = reviewData?.data?.data ?? reviewData?.data ?? []
  const avgRating: number = ratingData?.data?.averageRating ?? 0
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

  const handleSubmit = async (values: CreateReviewType) => {
    await createReview.mutateAsync(values, {
      onSuccess: (res) => {
        toast.success(res.message)
        resetCreate({ bookId, rating: 5, comment: "" })
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

  return (
    <div className="review mt-6 md:mt-10">
      <div className="flex items-center justify-between mb-6">
        <h6 className="font-bold text-xl md:text-2xl tracking-wide">Product Reviews</h6>

        {user && !alreadyReviewed && (
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
        )}
      </div>

      {totalReviews > 0 && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
          <div className="text-center">
            <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
            <StarRating value={Math.round(avgRating)} readonly />
            <div className="text-xs text-muted-foreground mt-1">{totalReviews} reviews</div>
          </div>
        </div>
      )}

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
        <div className="block md:flex gap-16 md:gap-32 items-center justify-center py-6">
          <img className="mx-auto md:mx-0" src="/images/review-empty.png" alt="No reviews" width={200} />
          <div className="text-gray-700 font-medium text-center mt-4 md:mt-0">
            <h5 className="text-[18px] mb-1 font-bold">No reviews yet</h5>
            <p className="text-sm mb-4 text-gray-500">Be the first to leave a review!</p>
            {!alreadyReviewed && (
              <Button variant="outline" className="w-2/4 md:w-full" onClick={handleWriteReview}>
                Write a Review
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review: Review) => {
            const isOwner = user?.id === review.userId
            return (
              <div key={review.id} className="flex gap-3">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarImage src={review.user?.profile} />
                  <AvatarFallback>
                    {review.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{review.user?.name ?? "User"}</p>
                      <div className="flex items-center gap-2">
                        <StarRating value={review.rating} readonly />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                    {isOwner && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleEditStart(review)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => handleDelete(review.id)} disabled={deleteReview.isPending}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BookReview