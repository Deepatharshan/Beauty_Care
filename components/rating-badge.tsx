interface RatingBadgeProps {
  rating: number
}

export default function RatingBadge({ rating }: RatingBadgeProps) {
  let label = "Excellent"
  let bgColor = "bg-green-100"
  let textColor = "text-green-800"

  if (rating >= 4.5) {
    label = "Excellent"
    bgColor = "bg-green-100"
    textColor = "text-green-800"
  } else if (rating >= 4) {
    label = "Very Good"
    bgColor = "bg-blue-100"
    textColor = "text-blue-800"
  } else if (rating >= 3) {
    label = "Good"
    bgColor = "bg-yellow-100"
    textColor = "text-yellow-800"
  } else if (rating >= 2) {
    label = "Fair"
    bgColor = "bg-orange-100"
    textColor = "text-orange-800"
  } else {
    label = "Poor"
    bgColor = "bg-red-100"
    textColor = "text-red-800"
  }

  return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bgColor} ${textColor}`}>{label}</span>
}
