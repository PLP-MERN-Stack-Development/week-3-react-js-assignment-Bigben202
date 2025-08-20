import { create } from 'zustand';
import { getTasks, createTask, updateTask, deleteTask } from '../utils/api';
import { socket } from '../utils/socket';
import { toast } from 'sonner';

export const useTaskStore = create((set, get) => {
  // --- Real-time listeners setup ---
  if (typeof window !== 'undefined' && socket && !socket._taskListenersAdded) {
    socket.on('taskCreated', (task) => {
      set((state) => ({ tasks: [task, ...state.tasks] }));
      toast.info('A new task was added.');
    });
    socket.on('taskUpdated', (task) => {
      set((state) => ({ tasks: state.tasks.map(t => t._id === task._id ? task : t) }));
      toast.info('A task was updated.');
    });
    socket.on('taskDeleted', ({ _id }) => {
      set((state) => ({ tasks: state.tasks.filter(t => t._id !== _id) }));
      toast.info('A task was deleted.');
    });
    socket._taskListenersAdded = true;
  }

  return {
    tasks: [],
    loading: false,
    filter: 'all', // all, active, completed
    currentPage: 1,
    totalPages: 1,
    setFilter: (filter) => {
      set({ filter, currentPage: 1 }); // Reset to first page on filter change
      get().fetchTasks();
    },
    setCurrentPage: (page) => {
      set({ currentPage: page });
      get().fetchTasks(page);
    },
    fetchTasks: async (page = get().currentPage) => {
      set({ loading: true });
      try {
        const res = await getTasks(`?page=${page}&limit=10`);
        set({ tasks: res.data.data, totalPages: res.data.totalPages, currentPage: res.data.currentPage });
      } catch (error) {
        // Optionally handle error
      } finally {
        set({ loading: false });
      }
    },
    addTask: async (data) => {
      await createTask(data);
      await get().fetchTasks(1); // Refresh and go to first page
    },
    updateTask: async (id, data) => {
      await updateTask(id, data);
      await get().fetchTasks(); // Refresh current page
    },
    deleteTask: async (id) => {
      await deleteTask(id);
      await get().fetchTasks(); // Refresh current page
    },
    filteredTasks: () => {
      const { tasks, filter } = get();
      if (filter === 'active') return tasks.filter(t => t.status !== 'completed');
      if (filter === 'completed') return tasks.filter(t => t.status === 'completed');
      return tasks;
    },
  };
}); 