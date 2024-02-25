import express from 'express'
import morgan from 'morgan'
import { AppDataSource } from './data-source'
import { User } from './entity/User'

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/', (_, res) => res.send('Hello world!'))

AppDataSource.initialize()
  .then(() => {
    console.log('DB connected')
  })
  .catch((error) => console.log(error))

app.post('/users', async (req, res) => {
  const newUser = await AppDataSource.getRepository(User).create(req.body)
  const results = await AppDataSource.getRepository(User).save(newUser)
  return res.send(results)
})

app.get('/users', async (_req, res) => {
  const results = await AppDataSource.getRepository(User).find()
  res.json(results)
})

app.get('/users/:id', async (req, res) => {
  const results = await AppDataSource.getRepository(User).findOneBy({
    id: parseInt(req.params.id),
  })
  return res.send(results)
})

app.put('/users/:id', async (req, res) => {
  const user = await AppDataSource.getRepository(User).findOneBy({
    id: parseInt(req.params.id),
  })
  AppDataSource.getRepository(User).merge(user, req.body)
  const results = await AppDataSource.getRepository(User).save(user)
  return res.send(results)
})

app.delete('/users/:id', async (req, res) => {
  const results = await AppDataSource.getRepository(User).delete({
    id: parseInt(req.params.id),
  })
  return res.send(results)
})

const port = 4000

app.listen(port, () => console.log(`Server is running on port ${port}`))
