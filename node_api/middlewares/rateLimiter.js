import {rateLimit} from 'express-rate-limit'

export const rateLimiterMiddleware = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 1,
    message: 'Too many requests, please try again after 10 seconds',
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false,
});