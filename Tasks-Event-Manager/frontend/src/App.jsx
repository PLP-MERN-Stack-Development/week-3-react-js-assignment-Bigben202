import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "./components/theme-provider";
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import TaskManager from './pages/TaskManager';
import EventScheduler from './pages/EventScheduler';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                <AuthProvider>
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route
                                path="/*"
                                element={
                                    <ProtectedRoute>
                                        <Layout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="tasks" element={<TaskManager />} />
                                <Route path="events" element={<EventScheduler />} />
                            </Route>
                        </Routes>
                    </ErrorBoundary>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App; 