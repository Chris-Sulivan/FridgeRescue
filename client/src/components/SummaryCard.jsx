import './SummaryCard.css'

// One magnet: a number with a label. tone can be "green", "yellow" or "red".
function SummaryCard({ value, label, tone }) {
  const className = tone ? `summary-card summary-card--${tone}` : 'summary-card'

  return (
    <span className={className}>
      <span className="summary-card__value">{value}</span>
      <span className="summary-card__label">{label}</span>
    </span>
  )
}

export default SummaryCard
