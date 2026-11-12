import ExpirationAlert from '../components/ExpirationAlert'
import sampleFoods from '../data/sampleFoods'

function Dashboard() {
  return (
    <>
      <h1>Dashboard page</h1>
      <ExpirationAlert items={sampleFoods} />
    </>
  )
}

export default Dashboard
