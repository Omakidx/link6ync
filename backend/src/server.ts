/**
 * @copyright Link6ync Contributors
 * @license Unlicensed
 */

/**
 * Node modoule imports
 */
import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import Link from '@/Schema/schema'
import helmet from 'helmet'
import cors from 'cors'
import { nanoid } from 'nanoid'
import connectDB from '@/database/db'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(compression())

app.use(helmet())

// Allow multiple frontend URLs
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))

app.post('/short', async (req, res) => {
  try {
    const { originalUrl } = req.body
    const shortUrl = nanoid(8)
    const url = await Link.create({ originalUrl, shortUrl })
    await url.save()
    res.json({ message: 'URL shortened successfully', url: url })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to shorten URL' })
  }
})

app.get('/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params
    const url = await Link.findOne({ shortUrl })
    if (!url) {
      return res.status(404).json({ error: 'URL not found' })
    }
    url.clicks++
    await url.save()
    return res.redirect(url.originalUrl)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to retrieve URL' })
  }
})

//Connect to MongoDB
const appConnection = async () => {
  try {
    await connectDB()
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

appConnection()
