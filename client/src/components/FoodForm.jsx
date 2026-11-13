import { useState } from 'react'
import './FoodForm.css'

const CATEGORIES = ['Dairy', 'Fruits', 'Vegetables', 'Meat', 'Other']
const UNITS = ['pieces', 'g', 'kg', 'ml', 'L', 'pack']
const SHELVES = [1, 2, 3]

const EMPTY_FOOD = {
  name: '',
  category: 'Dairy',
  quantity: 1,
  unit: 'pieces',
  shelf: 1,
  expirationDate: '',
}

// Returns an object with one message per field that has a problem
function validate(values) {
  const errors = {}

  if (!String(values.name).trim()) {
    errors.name = 'Food name is required.'
  }
  if (values.quantity === '' || Number(values.quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than 0.'
  }
  if (!values.expirationDate) {
    errors.expirationDate = 'Expiration date is required.'
  }

  return errors
}

// One form for both adding and editing.
// Pass initialValues to edit an existing item; leave it out to add a new one.
function FoodForm({ initialValues, onSave, onCancel }) {
  const isEditing = Boolean(initialValues)
  const [values, setValues] = useState({ ...EMPTY_FOOD, ...initialValues })
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const foundErrors = validate(values)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) return

    onSave({
      ...values,
      name: String(values.name).trim(),
      quantity: Number(values.quantity),
      shelf: Number(values.shelf),
    })
  }

  function fieldClass(fieldName) {
    return errors[fieldName]
      ? 'food-form__field food-form__field--error'
      : 'food-form__field'
  }

  return (
    <form className="food-form" onSubmit={handleSubmit} noValidate>
      <h1>{isEditing ? 'Edit food' : 'Add food'}</h1>

      <div className={fieldClass('name')}>
        <label htmlFor="food-name">Food name</label>
        <input
          id="food-name"
          name="name"
          type="text"
          placeholder="Milk"
          value={values.name}
          onChange={handleChange}
        />
        {errors.name && <p className="food-form__error">{errors.name}</p>}
      </div>

      <div className={fieldClass('category')}>
        <label htmlFor="food-category">Category</label>
        <select
          id="food-category"
          name="category"
          value={values.category}
          onChange={handleChange}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="food-form__row">
        <div className={fieldClass('quantity')}>
          <label htmlFor="food-quantity">Quantity</label>
          <input
            id="food-quantity"
            name="quantity"
            type="number"
            min="1"
            value={values.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <p className="food-form__error">{errors.quantity}</p>}
        </div>

        <div className={fieldClass('unit')}>
          <label htmlFor="food-unit">Unit</label>
          <select id="food-unit" name="unit" value={values.unit} onChange={handleChange}>
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="food-form__row">
        <div className={fieldClass('shelf')}>
          <label htmlFor="food-shelf">Shelf</label>
          <select id="food-shelf" name="shelf" value={values.shelf} onChange={handleChange}>
            {SHELVES.map((shelf) => (
              <option key={shelf} value={shelf}>Shelf {shelf}</option>
            ))}
          </select>
        </div>

        <div className={fieldClass('expirationDate')}>
          <label htmlFor="food-expiration">Expiration date</label>
          <input
            id="food-expiration"
            name="expirationDate"
            type="date"
            value={values.expirationDate}
            onChange={handleChange}
          />
          {errors.expirationDate && (
            <p className="food-form__error">{errors.expirationDate}</p>
          )}
        </div>
      </div>

      <div className="food-form__actions">
        <button type="submit" className="button">Save</button>
        <button type="button" className="button button--secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default FoodForm
