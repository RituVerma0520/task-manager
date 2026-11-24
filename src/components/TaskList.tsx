import type { Task } from '../tasks'

interface Props {
  filtered: boolean
  focusFilter: () => void
  tasks: Task[]
  emptyMessage: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskList({ tasks, filtered, focusFilter, emptyMessage, onToggle, onDelete }: Props) {
  function focusBeforeRemoval(control: HTMLInputElement | HTMLButtonElement) {
    if (document.activeElement !== control) return
    const row = control.closest('li')
    const neighbor = row?.nextElementSibling ?? row?.previousElementSibling
    const target = neighbor?.querySelector<HTMLElement>(control.tagName)
    if (target) target.focus()
    else focusFilter()
  }

  if (!tasks.length) return <p className="empty" role="status">{emptyMessage}</p>
  return (
    <ul aria-label="Tasks">
      {tasks.map(task => (
        <li key={task.id}>
          <label className="task">
            <input type="checkbox" checked={task.completed} onChange={event => {
              if (filtered) focusBeforeRemoval(event.currentTarget)
              onToggle(task.id)
            }} />
            <span>{task.name}</span>
          </label>
          <button className="delete" aria-label={'Delete ' + task.name}
            onClick={event => {
              focusBeforeRemoval(event.currentTarget)
              onDelete(task.id)
            }}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
