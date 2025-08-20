import { useEffect, useState } from 'react';
import { columns } from './tasks/columns';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';
import { TaskForm } from './tasks/task-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

const TaskSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
);

export default function TaskManager() {
  const {
    loading,
    filter,
    setFilter,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    filteredTasks,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  const handleCreate = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading('Deleting task...');
    try {
      await deleteTask(id);
      toast.success('Task deleted successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete task.', { id: toastId });
    }
  };

  const handleFormSubmit = async (data) => {
    const toastId = toast.loading(selectedTask ? 'Updating task...' : 'Creating task...');
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, data);
        toast.success('Task updated successfully', { id: toastId });
      } else {
        await addTask(data);
        toast.success('Task created successfully', { id: toastId });
      }
      setIsFormOpen(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error(selectedTask ? 'Failed to update task.' : 'Failed to create task.', { id: toastId });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreate} variant="gradient">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'active' ? 'default' : 'outline'} onClick={() => setFilter('active')}>Active</Button>
          <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>Completed</Button>
        </div>
      </div>

      <TaskForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onFinished={() => {
          setIsFormOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      {loading ? (
        <TaskSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
            data={filteredTasks()}
            filterColumn="title"
            filterPlaceholder="Filter tasks by title..."
          />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  disabled={currentPage <= 1}
                />
              </PaginationItem>
              {[...Array(totalPages).keys()].map((page) => (
                <PaginationItem key={page + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page + 1);
                    }}
                    isActive={currentPage === page + 1}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  disabled={currentPage >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
