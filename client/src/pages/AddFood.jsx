import { useNavigate } from 'react-router-dom'
import FoodForm from '../components/FoodForm'

function AddFood() {
  const navigate = useNavigate()

  function handleSave(food) {
    // Later: send to the API with POST /api/foods
    console.log('New food item:', food)
    navigate('/fridge')
  }

  return <FoodForm onSave={handleSave} onCancel={() => navigate('/fridge')} />
}

export default AddFood
