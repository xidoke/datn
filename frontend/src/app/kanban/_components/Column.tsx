import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Column as ColumnType, Issue, State } from '../_types/kanban'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import IssueCard from './IssueCard'
import IssueCreateModal from './IssueCreateModal'

interface ColumnProps {
  column: ColumnType & { state: State };
  onIssueClick: (issue: Issue) => void;
}

export default function Column({ column, onIssueClick }: ColumnProps) {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const Icon = column.icon;

  return (
    <div className="flex w-80 min-w-80 max-w-80 flex-col">
      <div className="mb-2 flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" style={{ color: column.color }} />}
          <h2 className="text-sm font-medium" style={{ color: column.color }}>
            {column.name}
          </h2>
          <span className="text-xs font-medium text-gray-500">
            {column.issues.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-gray-300"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-300"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Sửa trạng thái</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Xóa trạng thái
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 space-y-2 overflow-y-auto px-2"
          >
            {column.issues.map((issue, index) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                index={index}
                onClick={() => onIssueClick(issue)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <IssueCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        preSelectedState={column.state}
      />
    </div>
  );
}



