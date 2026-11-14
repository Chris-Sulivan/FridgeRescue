import { useState } from 'react'
import FormField from './FormField'
import { ErrorMessage } from './Feedback'
import './FoodForm.css'

const SHELVES = [1, 2, 3]

const EMPTY_FOOD = {
  name: '',
  categoryId: '',
  quantity: 1,
  unitId: '',
  shelf: '',
  expirationDate: '',
}

// Returns an object with one message per field that has a problem
function validate(values) {
  const errors = {}

  if (!String(values.name).trim()) {
    errors.name = 'Food name is required.'
  }
  if (!values.categoryId) {
    errors.categoryId = 'Choose a category.'
  }
  if (values.quantity === '' || Number(values.quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than 0.'
  }
  if (!values.unitId) {
    errors.unitId = 'Choose a unit.'
  }
  if (!values.expirationDate) {
    errors.expirationDate = 'Expiration date is required.'
  }

  return errors
}

// One form for both adding and editing.
// Pass initialValues to edit an existing item; leave it out to add a new one.
// categories and units are the lists from the API: [{ id, name }]
function FoodForm({ initialValues, categories, units, onSave, onCancel, saving = false, error = '' }) {
  const isEditing = Boolean(initialValues)
  const [values, setValues] = useState({
    ...EMPTY_FOOD,
    ...(initialValues && {
      name: initialValues.name,
      categoryId: initialValues.categoryId,
      quantity: initialValues.quantity,
      unitId: initialValues.unitId,
      shelf: initialValues.shelf,
      expirationDate: initialValues.expirationDate,
    }),
  })
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    // Clear this field's error as soon as the user edits it
    setErrors((current) => ({ ...current, [name]: undefined }))
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
      shelf: values.shelf === '' ? '' : Number(values.shelf),
    })
  }

  return (
    <form className="food-form" onSubmit={handleSubmit} noValidate>
      <h1>{isEditing ? 'Edit food' : 'Add food'}</h1>

      <ErrorMessage message={error} />

      <FormField
        label="Food name"
        name="name"
        type="text"
        placeholder="Milk"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />

      <FormField
        as="select"
        label="Category"
        name="categoryId"
        value={values.categoryId}
        onChange={handleChange}
        error={errors.categoryId}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </FormField>

      <div className="food-form__row">
        <FormField
          label="Quantity"
          name="quantity"
          type="number"
          min="0"
          step="any"
          value={values.quantity}
          onChange={handleChange}
          error={errors.quantity}
        />

        <FormField
          as="select"
          label="Unit"
          name="unitId"
          value={values.unitId}
          onChange={handleChange}
          error={errors.unitId}
        >
          <option value="">Select a unit</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>{unit.name}</option>
          ))}
        </FormField>
      </div>

      <div className="food-form__row">
        <FormField
          as="select"
          label="Shelf (optional)"
          name="shelf"
          value={values.shelf}
          onChange={handleChange}
          error={errors.shelf}
        >
          <option value="">No shelf</option>
          {SHELVES.map((shelf) => (
            <option key={shelf} value={shelf}>Shelf {shelf}</option>
          ))}
        </FormField>

        <FormField
          label="Expiration date"
          name="expirationDate"
          type="date"
          value={values.expirationDate}
          onChange={handleChange}
          error={errors.expirationDate}
        />
      </div>

      <div className="food-form__actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="button button--secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default FoodForm
