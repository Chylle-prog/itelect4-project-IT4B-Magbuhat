import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { authRouter } from './routes/auth.js'
import { itemRouter } from './routes/items.js'

export const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.FRONTEND_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? []),
]

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`))
    },
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
})

app.use('/api/auth', authRouter)
app.use('/api/items', itemRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` })
})

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(err.errors).map((error) => error.message),
      })
      return
    }

    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: `"${err.value}" is not a valid id` })
      return
    }

    if ('code' in err && err.code === 11000) {
      res.status(409).json({ message: 'That email is already registered' })
      return
    }

    console.error(err)
    res.status(500).json({ message: 'Something went wrong' })
  },
)

export default app