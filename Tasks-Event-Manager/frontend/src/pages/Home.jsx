import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl p-8 border shadow-lg mx-auto rounded-lg bg-white">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold mt-4 mb-2 text-gray-900 text-center">
            Welcome to Task-Event Manager
          </h1>
        </div>
        <p className="text-base text-gray-700 mb-4 text-center">
          Your all-in-one solution for managing tasks and events with ease.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li><b>Secure Authentication:</b> Sign up and log in to protect your data.</li>
          <li><b>Task Management:</b> Create, edit, and track your tasks.</li>
          <li><b>Event Scheduling:</b> Plan and manage your events.</li>
          <li><b>Modern Design:</b> Enjoy a clean and intuitive interface.</li>
        </ul>
        <div className="flex flex-col items-center mt-6">
          <Link to="/signup">
            <Button className="bg-blue-500 text-white rounded px-8 py-2">
              Get Started
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
} 