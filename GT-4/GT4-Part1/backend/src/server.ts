import 'dotenv/config'
import { app } from './app.js'
import { connectDB } from './config/db.js'

const port = Number(process.env.PORT) || 4000

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Copy .env.example to .env and fill it in.')
  }

  await connectDB()
  app.listen(port, () => console.log(`API on http://localhost:${port}`))
}

startServer().catch((error: unknown) => {
  console.error('Could not start:', error)
  process.exit(1)
})