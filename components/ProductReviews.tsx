'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

interface ProductReviewsProps {
  productId: string
  reviews?: Review[]
}

export default function ProductReviews({ productId, reviews = [] }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    comment: '',
  })
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>(reviews)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }))
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.author || !formData.comment) {
      alert('Please fill in all fields')
      return
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      author: formData.author,
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toLocaleDateString(),
    }

    setSubmittedReviews([newReview, ...submittedReviews])
    setFormData({ author: '', rating: 5, comment: '' })
    setShowReviewForm(false)
  }

  const averageRating = submittedReviews.length > 0
    ? (submittedReviews.reduce((sum, r) => sum + r.rating, 0) / submittedReviews.length).toFixed(1)
    : 0

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="font-heading text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Summary */}
      <div className="mb-8 p-6 bg-secondary/30 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold">{averageRating}</div>
          <div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(parseFloat(averageRating as any)) ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{submittedReviews.length} reviews</p>
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      <button
        onClick={() => setShowReviewForm(!showReviewForm)}
        className="mb-6 px-6 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
      >
        {showReviewForm ? 'Cancel' : 'Write a Review'}
      </button>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 border border-border bg-card rounded-lg animate-fade-in">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-border bg-background rounded focus:outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border bg-background rounded focus:outline-none focus:border-foreground"
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Good</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Poor</option>
                <option value={1}>1 Star - Terrible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full px-4 py-2 border border-border bg-background rounded focus:outline-none focus:border-foreground"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-foreground text-background py-2 font-semibold hover:bg-accent transition-colors duration-300"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {submittedReviews.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No reviews yet. Be the first to review!</p>
        ) : (
          submittedReviews.map((review, idx) => (
            <div
              key={review.id}
              className={`p-4 border border-border rounded-lg animate-fade-in delay-${idx * 100}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{review.author}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-foreground">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
