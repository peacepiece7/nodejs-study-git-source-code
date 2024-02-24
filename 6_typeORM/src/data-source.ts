import 'reflect-metadata' // 데코레이터를 사용하기 위해 필요
import { DataSource } from 'typeorm'
import { User } from './entity/User'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'postgres',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
})
