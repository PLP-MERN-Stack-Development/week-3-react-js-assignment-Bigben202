import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-6 px-6 md:px-8 bg-[#F7FAFC] border-t mt-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-6">
          <NavLink to="/dashboard" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">Dashboard</NavLink>
          <NavLink to="/tasks" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">Tasks</NavLink>
          <NavLink to="/events" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">Events</NavLink>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Tasks-Event-Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 