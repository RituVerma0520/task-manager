export interface Task {
  id: string
  name: string
  completed: boolean
}

export const filters = ['All', 'Pending', 'Completed'] as const
export type Filter = typeof filters[number]
