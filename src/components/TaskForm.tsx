import { useRef, useState, type FormEvent } from 'react'

export default function TaskForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState('')
  const [invalid, setInvalid] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    setInvalid(!trimmed)
    if (trimmed) {
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
          aria-invalid={invalid} aria-describedby={invalid ? 'name-error' : undefined}
          onChange={event => { setName(event.target.value); setInvalid(false) }} />
        <button className="add">Add task</button>
      </div>
      {invalid && <p role="alert" id="name-error">Enter a task name.</p>}
    </form>
  )
}
