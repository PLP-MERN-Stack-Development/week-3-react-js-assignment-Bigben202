import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Form } from "@/components/ui/form";
import { createTask, updateTask } from "@/utils/api";
import { useClerkAuth } from "@/hooks/useClerkAuth";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.date({ required_error: "Due date is required" }),
});

export function TaskForm({
  defaultValues,
  onSuccess,
  taskId,
  setTasks
}) {
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      dueDate: new Date(),
    },
  });
  const { user } = useClerkAuth();

  const onSubmit = async (data) => {
    if (!user) return toast.error("You must be signed in");
    if (!setTasks) {
      // fallback to original behavior if setTasks not provided
      try {
        if (taskId) {
          await updateTask(taskId, data);
          toast.success("Task updated!");
        } else {
          await createTask({ ...data, userId: user.id });
          toast.success("Task created!");
        }
        onSuccess && onSuccess();
        form.reset();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Error saving task");
      }
      return;
    }
    // Optimistic update for create
    if (!taskId) {
      const tempId = Date.now().toString();
      setTasks((prev) => [{ ...data, _id: tempId, userId: user.id, completed: false }, ...prev]);
      try {
        const res = await createTask({ ...data, userId: user.id });
        setTasks((prev) => prev.map((task) => (task._id === tempId ? res.data : task)));
        toast.success("Task created!");
        form.reset();
        onSuccess && onSuccess();
      } catch (err) {
        setTasks((prev) => prev.filter((task) => task._id !== tempId));
        toast.error(err?.response?.data?.message || "Error saving task");
      }
    } else {
      // Update
      try {
        await updateTask(taskId, data);
        toast.success("Task updated!");
        onSuccess && onSuccess();
        form.reset();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Error saving task");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input {...form.register("title")}
          placeholder="Title" />
        <Textarea {...form.register("description")}
          placeholder="Description" />
        <Calendar
          selected={form.watch("dueDate")}
          onSelect={(date) => form.setValue("dueDate", date)}
        />
        <Button type="submit">{taskId ? "Update" : "Create"} Task</Button>
      </form>
    </Form>
  );
}
