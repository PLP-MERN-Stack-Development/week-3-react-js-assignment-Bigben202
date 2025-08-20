import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, getEvents } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CheckSquare, PlusCircle, CalendarDays } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TaskCard = ({ task }) => (
    <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-r from-purple-100 to-indigo-100">
        <CardHeader>
            <CardTitle className="text-indigo-900 text-lg flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-purple-500" />
                {task.title}
            </CardTitle>
            <CardDescription className="text-indigo-700">
                Due: {new Date(task.dueDate).toLocaleDateString()}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                task.status === 'completed' ? 'bg-green-200 text-green-800' :
                task.status === 'in-progress' ? 'bg-yellow-200 text-yellow-800' :
                'bg-gray-200 text-gray-800'
            }`}>
                {task.status}
            </span>
        </CardContent>
    </Card>
);

const EventCard = ({ event }) => (
    <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-r from-pink-100 to-purple-100">
        <CardHeader>
            <CardTitle className="text-pink-900 text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-pink-500" />
                {event.title}
            </CardTitle>
            <CardDescription className="text-pink-700">
                {new Date(event.date).toLocaleString()}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {event.location && <p className="text-md text-pink-800">Location: {event.location}</p>}
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [tasksRes, eventsRes] = await Promise.all([getTasks(), getEvents()]);
            setTasks(tasksRes.data);
            setEvents(eventsRes.data);
        } catch (err) {
            setError('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRetry = () => {
        fetchData();
    };

    const filteredTasks = useMemo(() =>
        tasks.filter(task => new Date(task.dueDate).toDateString() === selectedDate.toDateString()),
        [tasks, selectedDate]
    );

    const filteredEvents = useMemo(() =>
        events.filter(event => new Date(event.date).toDateString() === selectedDate.toDateString()),
        [events, selectedDate]
    );

    // Stats
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-xl text-gray-600">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <main className="flex justify-center items-center min-h-[calc(100vh-128px)] bg-gradient-to-br from-purple-50 to-pink-50 p-4">
            <div className="w-full max-w-6xl space-y-8">
                <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                    Welcome{user && user.username ? `, ${user.username}` : ''}!
                </h1>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                            <Button onClick={handleRetry} className="ml-2">Retry</Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg border-0">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Total Tasks</CardTitle>
                            <CheckSquare className="w-7 h-7 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalTasks}</div>
                            <CardDescription className="text-white/80">Completed: {completedTasks}</CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-lg border-0">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Upcoming Events</CardTitle>
                            <CalendarDays className="w-7 h-7 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{upcomingEvents}</div>
                            <CardDescription className="text-white/80">Don&apos;t miss out!</CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white shadow-lg border-0">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Today</CardTitle>
                            <CalendarIcon className="w-7 h-7 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-semibold">{selectedDate.toDateString()}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                    {/* Calendar */}
                    <div className="md:col-span-1">
                        <Card className="shadow-md border-0 bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg text-indigo-800 flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-indigo-500" />
                                    Pick a Date
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-lg border"
                                />
                            </CardContent>
                        </Card>
                    </div>
                    {/* Tasks & Events */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card className="shadow-md border-0 bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                                    <CheckSquare className="w-5 h-5 text-purple-500" />
                                    Tasks for {selectedDate.toDateString()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {filteredTasks.length > 0 ? (
                                    <div className="grid gap-3">
                                        {filteredTasks.map(task => (
                                            <TaskCard key={task._id} task={task} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No tasks for this day.</p>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="shadow-md border-0 bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg text-pink-800 flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5 text-pink-500" />
                                    Events for {selectedDate.toDateString()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {filteredEvents.length > 0 ? (
                                    <div className="grid gap-3">
                                        {filteredEvents.map(event => (
                                            <EventCard key={event._id} event={event} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No events for this day.</p>
                                )}
                            </CardContent>
                        </Card>
                        <div className="flex gap-4 justify-end">
                            <Button
                                onClick={() => navigate('/tasks')}
                                variant="default"
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center gap-2 shadow-md"
                            >
                                <PlusCircle className="w-4 h-4" /> New Task
                            </Button>
                            <Button
                                onClick={() => navigate('/events')}
                                variant="default"
                                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center gap-2 shadow-md"
                            >
                                <PlusCircle className="w-4 h-4" /> New Event
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}