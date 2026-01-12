'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/templates'
import { Button, Input, Label, FormItem } from '@/components/atoms'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { PublicPage } from '@/lib/components/ProtectedPage'

interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const { signup, isLoading } = useAuth()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>()

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null)
    try {
      const success = await signup(data.email, data.password)
      if (success) {
        // Redirect to feed page on successful signup
        router.push('/')
      } else {
        setServerError('Signup failed. Please try again.')
      }
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'An error occurred during signup'
      )
    }
  }

  const passwordStrength = {
    hasLength: password?.length >= 8,
    hasUppercase: /[A-Z]/.test(password || ''),
    hasNumber: /[0-9]/.test(password || ''),
    hasSpecial: /[!@#$%^&*]/.test(password || ''),
  }

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length

  return (
    <PublicPage>
      <AuthLayout
        title="Create Account"
        subtitle="Join FeedHub and start sharing!"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Server Error Message */}
          {serverError && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {serverError}
            </div>
          )}

          {/* Email Field */}
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
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  onChange: (e) => setPassword(e.target.value),
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < strengthScore ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                </div>
                <div className="text-xs space-y-1">
                  <div
                    className={`flex items-center gap-1 ${
                      passwordStrength.hasLength
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Check className="size-3" />
                    At least 8 characters
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      passwordStrength.hasUppercase
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Check className="size-3" />
                    One uppercase letter
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      passwordStrength.hasNumber
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Check className="size-3" />
                    One number
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      passwordStrength.hasSpecial
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Check className="size-3" />
                    One special character
                  </div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-destructive text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </FormItem>

          {/* Confirm Password */}
          <FormItem>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </FormItem>

          {/* Terms Agreement */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              disabled={isLoading}
              className="mt-1"
            />
            <span className="text-sm text-muted-foreground">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PublicPage>
  )
}
