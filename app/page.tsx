'use client'

import { useState } from 'react'
import { trackWaitlistSignup } from '@/lib/analytics'

type WaitlistState = 'idle' | 'loading' | 'success' | 'error'

export default function Home() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<WaitlistState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submissions
    if (state === 'loading') return

    // Reset error state and clear success state
    setErrorMessage('')
    setState('loading')

    try {
      const response = await fetch('/api/joinWaitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setState('success')
        trackWaitlistSignup(email, true)
        setEmail('') // Clear email on success
        // Reset to idle after 3 seconds to allow new submissions
        setTimeout(() => {
          setState('idle')
        }, 3000)
      } else {
        setState('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        trackWaitlistSignup(email, false)
      }
    } catch (error) {
      setState('error')
      setErrorMessage('Network error. Please check your connection and try again.')
      trackWaitlistSignup(email, false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Grocab</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                // Reset state to idle when user starts typing again
                if (state === 'success' || state === 'error') {
                  setState('idle')
                  setErrorMessage('')
                }
              }}
              placeholder="Enter your email"
              disabled={state === 'loading'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={state === 'loading' || !email.trim()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {state === 'loading' && (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {state === 'success' && (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>
              {state === 'loading' && 'Joining...'}
              {state === 'success' && "You're on the list!"}
              {state !== 'loading' && state !== 'success' && 'Join Waitlist'}
            </span>
          </button>
        </form>

        {state === 'error' && errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm transition-all duration-200">
            {errorMessage}
          </div>
        )}

        {state === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm transition-all duration-200">
            You're on the list! We'll be in touch soon.
          </div>
        )}
      </div>
    </main>
  )
}

