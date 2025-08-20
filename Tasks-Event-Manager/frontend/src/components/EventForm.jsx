import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { createEvent, updateEvent } from "@/utils/api";
import { useClerkAuth } from "@/hooks/useClerkAuth";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  recurrence: z.enum(["none", "daily", "weekly", "monthly"]),
});

export function EventForm({
  defaultValues,
  onSuccess,
  eventId,
  setEvents
}) {
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      recurrence: "none",
    },
  });
  const { user } = useClerkAuth();

  const onSubmit = async (data) => {
    if (!user) return toast.error("You must be signed in");
    if (!setEvents) {
      try {
        if (eventId) {
          await updateEvent(eventId, data);
          toast.success("Event updated!");
        } else {
          await createEvent({ ...data, userId: user.id });
          toast.success("Event created!");
        }
        onSuccess && onSuccess();
        form.reset();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Error saving event");
      }
      return;
    }
    if (!eventId) {
      const tempId = Date.now().toString();
      setEvents((prev) => [{ ...data, _id: tempId, userId: user.id }, ...prev]);
      try {
        const res = await createEvent({ ...data, userId: user.id });
        setEvents((prev) => prev.map((event) => (event._id === tempId ? res.data : event)));
        toast.success("Event created!");
        form.reset();
        onSuccess && onSuccess();
      } catch (err) {
        setEvents((prev) => prev.filter((event) => event._id !== tempId));
        toast.error(err?.response?.data?.message || "Error saving event");
      }
    } else {
      try {
        await updateEvent(eventId, data);
        toast.success("Event updated!");
        onSuccess && onSuccess();
        form.reset();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Error saving event");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input {...form.register("title")} placeholder="Title" />
        <Textarea {...form.register("description")} placeholder="Description" />
        <div className="flex gap-2">
          <Calendar
            selected={form.watch("startDate")}
            onSelect={(date) => form.setValue("startDate", date)}
          />
          <Calendar
            selected={form.watch("endDate")}
            onSelect={(date) => form.setValue("endDate", date)}
          />
        </div>
        <Select
          value={form.watch("recurrence")}
          onValueChange={(val) => form.setValue("recurrence", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Recurrence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">{eventId ? "Update" : "Create"} Event</Button>
      </form>
    </Form>
  );
}
