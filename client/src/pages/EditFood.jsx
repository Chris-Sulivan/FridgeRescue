import { Link, useNavigate, useParams } from 'react-router-dom'
import FoodForm from '../components/FoodForm'
import sampleFoods from '../data/sampleFoods'

function EditFood() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Later: load the item from the API with GET /api/foods/:id
  const food = sampleFoods.find((item) => String(item.id) === id)

  function handleSave(updatedFood) {
    // Later: send to the API with PUT /api/foods/:id
    console.log('Updated food item:', updatedFood)
    navigate('/fridge')
  }

  if (!food) {
    return (
      <div>
        <h1>Food item not found</h1>
        <Link to="/fridge">Back to My Fridge</Link>
      </div>
    )
  }

  return (
    <FoodForm
      initialValues={food}
      onSave={handleSave}
      onCancel={() => navigate('/fridge')}
    />
  )
}

export default EditFood
