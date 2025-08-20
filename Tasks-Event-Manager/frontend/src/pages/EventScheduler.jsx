import React, { useState, useEffect } from 'react';
import { getEvents, deleteEvent, createEvent, updateEvent } from '../utils/api';
import { columns } from './events/columns';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PlusCircle, List, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { EventForm } from './events/event-form';
import { socket } from '../utils/socket';

export default function EventScheduler() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      setEvents(res.data);
    } catch (error) {
      toast.error('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Real-time listeners
  useEffect(() => {
    if (!socket) return;
    const onCreated = (event) => {
      setEvents((prev) => [event, ...prev]);
      toast.info('A new event was added.');
    };
    const onUpdated = (event) => {
      setEvents((prev) => prev.map(e => e._id === event._id ? event : e));
      toast.info('An event was updated.');
    };
    const onDeleted = ({ _id }) => {
      setEvents((prev) => prev.filter(e => e._id !== _id));
      toast.info('An event was deleted.');
    };
    socket.on('eventCreated', onCreated);
    socket.on('eventUpdated', onUpdated);
    socket.on('eventDeleted', onDeleted);
    return () => {
      socket.off('eventCreated', onCreated);
      socket.off('eventUpdated', onUpdated);
      socket.off('eventDeleted', onDeleted);
    };
  }, []);

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading('Deleting event...');
    try {
      await deleteEvent(id);
      toast.success('Event deleted successfully', { id: toastId });
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event.', { id: toastId });
    }
  };

  const handleFormSubmit = async (data) => {
    const toastId = toast.loading(selectedEvent ? 'Updating event...' : 'Creating event...');
    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, data);
        toast.success('Event updated successfully', { id: toastId });
      } else {
        await createEvent(data);
        toast.success('Event created successfully', { id: toastId });
      }
      fetchEvents();
      setIsFormOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      toast.error(selectedEvent ? 'Failed to update event.' : 'Failed to create event.', { id: toastId });
    }
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Events</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setView(v => v === 'calendar' ? 'list' : 'calendar')} className="mr-2">
            {view === 'calendar' ? <List className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
          </Button>
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>
      
      <EventForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onFinished={() => {
          setIsFormOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSubmit={async (data) => {
          const toastId = toast.loading(selectedEvent ? 'Updating event...' : 'Creating event...');
          try {
            if (selectedEvent) {
              await updateEvent(selectedEvent._id, data);
              toast.success('Event updated successfully.', { id: toastId });
            } else {
              await createEvent(data);
              toast.success('Event created successfully.', { id: toastId });
            }
            await fetchEvents();
            return true;
          } catch (error) {
            toast.error(selectedEvent ? 'Failed to update event.' : 'Failed to create event.', { id: toastId });
            return false;
          }
        }}
      />

      {view === 'list' ? (
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={events}
          filterColumn="title"
          filterPlaceholder="Filter events by title..."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Calendar
              mode="multiple"
              selected={events.map(e => new Date(e.date))}
              className="w-full"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
