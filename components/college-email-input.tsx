'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

// TypeScript interface for validation state
interface EmailValidationState {
  isValid: boolean
  error: string
  isPristine: boolean
}

interface CollegeEmailInputProps {
  value: string
  onChange: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
}

// Blocked personal email domains
const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']

// Regex to match .edu and .edu.in domains
const COLLEGE_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|edu\.in)$/i

export default function CollegeEmailInput({
  value,
  onChange,
  onValidationChange,
  placeholder = 'student@college.edu',
  className = '',
  label = 'College Email',
  required = false
}: CollegeEmailInputProps) {
  const [validationState, setValidationState] = useState<EmailValidationState>({
    isValid: false,
    error: '',
    isPristine: true
  })

  // Validate email in real-time
  useEffect(() => {
    if (!value || validationState.isPristine) {
      setValidationState({
        isValid: false,
        error: '',
        isPristine: validationState.isPristine
      })
      onValidationChange?.(false)
      return
    }

    // Extract domain from email
    const emailParts = value.split('@')
    if (emailParts.length !== 2) {
      setValidationState({
        isValid: false,
        error: 'Invalid email format',
        isPristine: false
      })
      onValidationChange?.(false)
      return
    }

    const domain = emailParts[1].toLowerCase()

    // Check if it's a blocked personal email domain
    if (BLOCKED_DOMAINS.includes(domain)) {
      setValidationState({
        isValid: false,
        error: 'Personal emails not allowed',
        isPristine: false
      })
      onValidationChange?.(false)
      return
    }

    // Check if email matches college domain pattern
    if (!COLLEGE_EMAIL_REGEX.test(value)) {
      setValidationState({
        isValid: false,
        error: 'Must use college email ending with .edu or .edu.in',
        isPristine: false
      })
      onValidationChange?.(false)
      return
    }

    // Email is valid
    setValidationState({
      isValid: true,
      error: '',
      isPristine: false
    })
    onValidationChange?.(true)
  }, [value, validationState.isPristine, onValidationChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Mark as not pristine after first interaction
    if (validationState.isPristine && newValue) {
      setValidationState(prev => ({ ...prev, isPristine: false }))
    }
  }

  const handleBlur = () => {
    // Mark as not pristine on blur
    if (validationState.isPristine) {
      setValidationState(prev => ({ ...prev, isPristine: false }))
    }
  }

  // Determine border color based on validation state
  const getBorderColor = () => {
    if (validationState.isPristine || !value) return 'border-gray-200'
    if (validationState.isValid) return 'border-green-500'
    return 'border-red-500'
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Input
          type="email"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full border-2 ${getBorderColor()} focus:border-[#014b89] focus:ring-[#014b89] rounded-xl h-11 sm:h-12 pr-12 transition-all text-sm sm:text-base`}
        />
        
        {/* Validation Icon */}
        {!validationState.isPristine && value && (
          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
            {validationState.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {!validationState.isPristine && validationState.error && (
        <div className="mt-2 flex items-start gap-2 text-sm text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{validationState.error}</span>
        </div>
      )}

      {/* Success Message */}
      {!validationState.isPristine && validationState.isValid && (
        <div className="mt-2 flex items-start gap-2 text-sm text-green-600 animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Valid college email</span>
        </div>
      )}
    </div>
  )
}
