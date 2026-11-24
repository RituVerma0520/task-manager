import { useRef, useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { filters, loadTasks, normalizedName, storageKey, type Filter, type Task } from './tasks'

export default function App() {
  const [{ tasks, storageUnavailable }, setTaskState] = useState(loadTasks)
  const [filter, setFilter] = useState<Filter>('All')
  const activeFilterButton = useRef<HTMLButtonElement>(null)
  const total = tasks.length
  const completed = tasks.filter(task => task.completed).length
  const visible = tasks.filter(task => filter === 'All' || task.completed === (filter === 'Completed'))
  const emptyMessage = total ? 'No ' + filter.toLowerCase() + ' tasks.' : 'No tasks yet. Add your first task above.'

  function updateTasks(next: Task[]) {
    let unavailable = storageUnavailable
    if (!unavailable) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        unavailable = true
      }
    }
    setTaskState({ tasks: next, storageUnavailable: unavailable })
  }

  function validateName(name: string) {
    if (!name.trim()) return 'Enter a task name.'
    const key = normalizedName(name)
    if (tasks.some(task => normalizedName(task.name) === key)) {
      return 'A task with this name already exists.'
    }
    return ''
  }

  function add(name: string) {
    const task = { id: crypto.randomUUID(), name, completed: false }
    updateTasks([...tasks, task])
  }

  function toggle(id: string) {
    updateTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  function remove(id: string) {
    updateTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <main>
      <h1>Task Manager</h1>
      <dl aria-label="Task counts">
        <div><dt>Total</dt><dd>{total}</dd></div>
        <div><dt>Pending</dt><dd>{total - completed}</dd></div>
        <div><dt>Completed</dt><dd>{completed}</dd></div>
      </dl>
      <TaskForm validateName={validateName} onAdd={add} />
      {storageUnavailable && <p role="status">Browser storage is unavailable. Changes may be lost on refresh.</p>}
      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">Tasks</h2>
        <div role="group" aria-label="Filter tasks" className="filters">
          {filters.map(option => <button key={option} ref={filter === option ? activeFilterButton : null} aria-pressed={filter === option}
            onClick={() => setFilter(option)}>{option}</button>)}
        </div>
        <TaskList filtered={filter !== 'All'} focusFilter={() => activeFilterButton.current?.focus()}
          tasks={visible} emptyMessage={emptyMessage} onToggle={toggle} onDelete={remove} />
      </section>
    </main>
  )
}
