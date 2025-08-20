import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package2, Lock, User2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email('Email is required.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading('Signing in...');
    try {
      const res = await loginUser(data); // data now has email and password
      toast.success(`Welcome back!`, { id: toastId });
      login(res.data.token);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign in failed.', { id: toastId });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 shadow-lg mb-2">
            <Package2 className="w-9 h-9 text-white" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-indigo-900">Sign In</CardTitle>
          <CardDescription className="text-md text-gray-600 text-center">
            Welcome back! Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-indigo-800 flex items-center gap-1">
                <User2 className="w-4 h-4 text-indigo-400" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="focus:ring-2 focus:ring-purple-400/60"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-indigo-800 flex items-center gap-1">
                <Lock className="w-4 h-4 text-indigo-400" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="focus:ring-2 focus:ring-pink-400/60"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:from-indigo-500 hover:to-purple-500 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Separator />
          <p className="text-sm text-center text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-purple-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}