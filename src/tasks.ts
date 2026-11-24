export interface Task {
  id: string
  name: string
  completed: boolean
}

export const filters = ['All', 'Pending', 'Completed'] as const
export type Filter = typeof filters[number]

export const storageKey = 'task-manager.tasks'

export function normalizedName(name: string) {
  return name.trim().normalize('NFC').toLowerCase().toUpperCase().normalize('NFC')
}

interface TaskState {
  tasks: Task[]
  storageUnavailable: boolean
}

function validTasks(value: unknown): value is Task[] {
  if (!Array.isArray(value)) return false
  const ids = new Set<string>()
  const names = new Set<string>()
  for (const task of value) {
    if (!task || typeof task.id !== 'string' || !task.id.trim() ||
        typeof task.name !== 'string' || !task.name.trim() ||
        typeof task.completed !== 'boolean') return false

    const name = normalizedName(task.name)
    if (ids.has(task.id) || names.has(name)) return false
    ids.add(task.id)
    names.add(name)
  }
  return true
}

export function loadTasks(): TaskState {
  let raw: string | null
  try {
    raw = localStorage.getItem(storageKey)
  } catch {
    return { tasks: [], storageUnavailable: true }
  }

  if (raw !== null) {
    try {
      const value: unknown = JSON.parse(raw)
      if (validTasks(value)) return { tasks: value, storageUnavailable: false }
    } catch {
      // A malformed collection follows the same recovery path as an invalid one.
    }
  }
  return { tasks: [], storageUnavailable: false }
}
