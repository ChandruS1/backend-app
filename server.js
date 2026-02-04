require('dotenv').config()
const express = require('express')
const logger = require('./logger')
const { register, httpReqDuration } = require('./metrics')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  const end = httpReqDuration.startTimer()
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode })
  })
  next()
})

app.get('/health', (req, res) => {
  res.json({ status: 'UP' })
})

let users = []

app.get('/users', (req, res) => {
  logger.info('Fetching users')
  res.json(users)
})

app.post('/users', (req, res) => {
  const user = req.body

  if (!user.name) {
    logger.warn('Invalid user data')
    return res.status(400).json({ error: 'Name required' })
  }

  users.push(user)
  logger.info(`User added: ${user.name}`)

  res.status(201).json(user)
})

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
