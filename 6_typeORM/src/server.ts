import express from 'express'
import morgan from 'morgan'
import { AppDataSource } from './data-source'

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/', (_, res) => res.send('Hello world!'))

AppDataSource.initialize()
  .then(() => {
    console.log('DB connected')
  })
  .catch((error) => console.log(error))

const port = 4000

app.listen(port, () => console.log(`Server is running on port ${port}`))
