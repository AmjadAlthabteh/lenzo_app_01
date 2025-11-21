import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyGenerator?: (req: NextRequest) => string // Custom key generator
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req) => {
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return ip
    },
  } = config

  return {
    check: async (req: NextRequest, identifier?: string) => {
      const key = identifier || keyGenerator(req)
      const now = Date.now()

      // Initialize or get current record
      if (!store[key] || store[key].resetTime < now) {
        store[key] = {
          count: 0,
          resetTime: now + windowMs,
        }
      }

      const record = store[key]
      record.count++

      const isRateLimited = record.count > maxRequests
      const remaining = Math.max(0, maxRequests - record.count)
      const resetTime = record.resetTime

      return {
        success: !isRateLimited,
        limit: maxRequests,
        remaining,
        reset: new Date(resetTime),
        retryAfter: isRateLimited ? Math.ceil((resetTime - now) / 1000) : 0,
      }
    },
  }
}

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
})

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
})

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
})

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limiter = apiRateLimit
) {
  return async (req: NextRequest) => {
    const result = await limiter.check(req)

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.reset.toISOString(),
            'Retry-After': result.retryAfter.toString(),
          },
        }
      )
    }

    const response = await handler(req)

    response.headers.set('X-RateLimit-Limit', result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.reset.toISOString())

    return response
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 60 * 60 * 1000) // Cleanup every hour
