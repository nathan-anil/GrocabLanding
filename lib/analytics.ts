/**
 * Google Analytics event tracking utilities
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

/**
 * Track waitlist signup
 */
export function trackWaitlistSignup(email: string, success: boolean) {
  trackEvent(
    success ? 'waitlist_signup_success' : 'waitlist_signup_error',
    'Waitlist',
    email,
    success ? 1 : 0
  )
}

/**
 * Track page view (handled automatically by gtag config, but can be used for SPA navigation)
 */
export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: path,
    })
  }
}

