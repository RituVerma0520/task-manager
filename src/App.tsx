import { useRef, useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { filters, type Filter, type Task } from './tasks'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('All')
  const activeFilterButton = useRef<HTMLButtonElement>(null)
  const total = tasks.length
  const completed = tasks.filter(task => task.completed).length
  const visible = tasks.filter(task => filter === 'All' || task.completed === (filter === 'Completed'))
  const emptyMessage = total ? 'No ' + filter.toLowerCase() + ' tasks.' : 'No tasks yet. Add your first task above.'

  function add(name: string) {
    const task = { id: crypto.randomUUID(), name, completed: false }
    setTasks(current => [...current, task])
  }

  function toggle(id: string) {
    setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  function remove(id: string) {
    setTasks(current => current.filter(task => task.id !== id))
  }

  return (
    <main>
      <h1>Task Manager</h1>
      <dl aria-label="Task counts">
        <div><dt>Total</dt><dd>{total}</dd></div>
        <div><dt>Pending</dt><dd>{total - completed}</dd></div>
        <div><dt>Completed</dt><dd>{completed}</dd></div>
      </dl>
      <TaskForm onAdd={add} />
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
