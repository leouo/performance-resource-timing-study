const express = require('express')
const cors = require('cors')

const PORT = 3001

const app = express()

app.use(cors())

app.get('/route-with-delay', (req, res) => {
  setTimeout(() => {
    // This header is used to allow the browser to report the timing information
    // to the client. This is VERY important for the PerformanceResourceTiming API.
    res.setHeader('Timing-Allow-Origin', '*')
    res.json({ message: 'This is a delayed response!' })
  }, 2000)
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
