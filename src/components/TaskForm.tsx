import { useRef, useState, type FormEvent } from 'react'

interface Props {
  validateName: (name: string) => string
  onAdd: (name: string) => void
}

export default function TaskForm({ validateName, onAdd }: Props) {
  const [name, setName] = useState('')
  const [showValidation, setShowValidation] = useState(false)
  const error = showValidation ? validateName(name) : ''
  const input = useRef<HTMLInputElement>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    const message = validateName(trimmed)
    setShowValidation(Boolean(message))
    if (!message) {
      onAdd(trimmed)
      setName('')
    }
    input.current?.focus()
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="task-name">New task</label>
      <div className="entry">
        <input id="task-name" ref={input} value={name} placeholder="What needs doing?"
          aria-invalid={Boolean(error)} aria-describedby={error ? 'name-error' : undefined}
          onChange={event => { setName(event.target.value); setShowValidation(false) }} />
        <button className="add">Add task</button>
      </div>
      {error && <p role="alert" id="name-error">{error}</p>}
    </form>
  )
}
