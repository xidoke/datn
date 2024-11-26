import { Board, Label, User, Sprint } from '../_types/kanban'

export const mockLabels: Label[] = [
  { id: '1', name: 'Backend', color: 'bg-blue-600', textColor: 'text-blue-100' },
  { id: '2', name: 'Development', color: 'bg-orange-600', textColor: 'text-orange-100' },
  { id: '3', name: 'Design', color: 'bg-purple-600', textColor: 'text-purple-100' },
  { id: '4', name: 'Planning', color: 'bg-green-600', textColor: 'text-green-100' },
]

export const mockUsers: User[] = [
  { id: '1', name: 'Alice', avatar: '/placeholder.svg?height=24&width=24' },
  { id: '2', name: 'Bob', avatar: '/placeholder.svg?height=24&width=24' },
]

export const mockSprints: Sprint[] = [
  { id: '1', name: 'Sprint 1: Tập trung vào...' },
]

export const mockBoard: Board = {
  columns: [
    {
      id: 'backlog',
      title: 'Backlog',
      color: 'text-gray-400',
      issues: [
        {
          id: 'DATN-25',
          title: 'về usecase',
          labels: [mockLabels[0]],
          assignees: [mockUsers[0]],
          sprint: mockSprints[0],
          type: 'task',
        },
        {
          id: 'DATN-24',
          title: 'Xây dựng giao diện quản lý người dùng',
          labels: [mockLabels[1], mockLabels[2]],
          assignees: [mockUsers[1]],
          sprint: mockSprints[0],
          type: 'feature',
        },
      ],
    },
    {
      id: 'todo',
      title: 'Todo',
      color: 'text-gray-300',
      issues: [
        {
          id: 'DATN-23',
          title: 'Xây dựng API quản lý người dùng',
          labels: [mockLabels[0], mockLabels[1]],
          assignees: [mockUsers[0]],
          dueDate: '2024-10-15',
          type: 'task',
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'text-yellow-500',
      icon: '⏳',
      issues: [
        {
          id: 'DATN-5',
          title: 'Thiết kế API',
          labels: [mockLabels[2]],
          assignees: [mockUsers[1]],
          dueDate: '2024-10-08',
          sprint: mockSprints[0],
          type: 'task',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: 'text-green-500',
      icon: '✓',
      issues: [
        {
          id: 'DATN-1',
          title: 'Nghiên cứu Plane.so',
          labels: [mockLabels[3]],
          assignees: [mockUsers[0]],
          dueDate: '2024-09-27',
          sprint: mockSprints[0],
          type: 'task',
        },
      ],
    },
  ],
}

