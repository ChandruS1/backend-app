const client = require('prom-client')

const register = new client.Registry()

client.collectDefaultMetrics({ register })

const httpReqDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
})

register.registerMetric(httpReqDuration)

module.exports = { register, httpReqDuration }
