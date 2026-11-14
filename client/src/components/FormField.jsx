// One labelled input or select with an inline error message.
// Reused by Login, Register and the food form.
// Usage: <FormField label="Email" name="email" type="email" value={...} onChange={...} error={...} />
//        <FormField as="select" label="Unit" name="unit" ...><option>...</option></FormField>
function FormField({ label, name, error, as: Tag = 'input', children, ...props }) {
  const id = `field-${name}`
  const className = error ? 'food-form__field food-form__field--error' : 'food-form__field'

  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <Tag
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {children}
      </Tag>
      {error && (
        <p id={`${id}-error`} className="food-form__error">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
