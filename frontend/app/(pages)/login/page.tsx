'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/templates'
import { Button, Input, Label, FormItem } from '@/components/atoms'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/lib/contexts/AuthContext'

interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    try {
      const success = await login(data.email, data.password)
      if (success) {
        // Redirect to feed page on successful login
        router.push('/')
      } else {
        setServerError('Invalid email or password')
      }
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'An error occurred during login'
      )
    }
  }

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to FeedHub!">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Server Error Message */}
        {serverError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {serverError}
          </div>
        )}
        <FormItem>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </FormItem>

        {/* Password Field */}
        <FormItem>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </FormItem>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              disabled={isLoading}
              className="rounded"
            />
            <span className="text-sm">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up here
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
