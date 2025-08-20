import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createTask, updateTask } from '../../utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required.'),
  completed: z.boolean().default(false),
});

export function TaskForm({ isOpen, setIsOpen, task, onFinished }) {
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      completed: false,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        dueDate: '',
        completed: false,
      });
    }
  }, [task, isOpen, form]);

  const onSubmit = async (values) => {
    const toastId = toast.loading(task ? 'Updating task...' : 'Creating task...');
    try {
      if (task) {
        await updateTask(task._id, values);
        toast.success('Task updated successfully.', { id: toastId });
      } else {
        await createTask(values);
        toast.success('Task created successfully.', { id: toastId });
      }
      if (onFinished) onFinished();
      if (setIsOpen) setIsOpen(false);
    } catch (error) {
      toast.error(task ? 'Failed to update task.' : 'Failed to create task.', { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register('description')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...form.register('dueDate')} />
            {form.formState.errors.dueDate && <p className="text-sm text-red-500">{form.formState.errors.dueDate.message}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="completed" {...form.register('completed')} checked={form.watch('completed')} onCheckedChange={(checked) => form.setValue('completed', checked)} />
            <label
              htmlFor="completed"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Completed
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 