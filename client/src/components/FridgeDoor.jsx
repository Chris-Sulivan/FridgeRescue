import { Link } from 'react-router-dom'
import SummaryCard from './SummaryCard'
import './FridgeDoor.css'

function FridgeDoor({ summary }) {
  return (
    <Link to="/fridge" className="fridge" aria-label="Open my fridge">
      <span className="fridge__door fridge__door--top">
        <span className="fridge__handle" />
        <span className="fridge__magnets">
          <SummaryCard value={summary.total} label="Items" />
          <SummaryCard value={summary.fresh} label="Fresh" tone="green" />
          <SummaryCard value={summary.expiring} label="Expiring" tone="yellow" />
          <SummaryCard value={summary.expired} label="Expired" tone="red" />
        </span>
      </span>
      <span className="fridge__door fridge__door--bottom">
        <span className="fridge__handle fridge__handle--long" />
        <span className="fridge__cta">Tap to open</span>
      </span>
    </Link>
  )
}

export default FridgeDoor
