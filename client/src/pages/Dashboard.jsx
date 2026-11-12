import FridgeDoor from '../components/FridgeDoor'
import sampleFoods from '../data/sampleFoods'
import { summarizeFoods } from '../utils/summary'
import './Dashboard.css'

function Dashboard() {
  // Sample data for now. Later this comes from the API (GET /api/foods).
  const summary = summarizeFoods(sampleFoods)

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Home</h1>
      <FridgeDoor summary={summary} />
    </div>
  )
}

export default Dashboard
