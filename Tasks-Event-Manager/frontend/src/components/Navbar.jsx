import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from './theme-provider';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    const nextTheme = theme === 'light' ? 'dark' : 'light';
    const themeIcon = theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
    );

    return (
        <nav className="bg-[#F7FAFC] border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-purple-600">TaskEventManager</h1>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive ? 'bg-[#6B46C1] text-white' : 'text-gray-700 hover:bg-purple-100'
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/tasks"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive ? 'bg-[#6B46C1] text-white' : 'text-gray-700 hover:bg-purple-100'
                                    }`
                                }
                            >
                                Tasks
                            </NavLink>
                            <NavLink
                                to="/events"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive ? 'bg-[#6B46C1] text-white' : 'text-gray-700 hover:bg-purple-100'
                                    }`
                                }
                            >
                                Events
                            </NavLink>
                            {/* Theme Toggle Button */}
                            <button
                                onClick={() => setTheme(nextTheme)}
                                className="ml-4 p-2 rounded-full hover:bg-purple-200 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {themeIcon}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 