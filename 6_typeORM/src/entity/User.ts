import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

/**
 * @note Entity가 없을땐 다음 예제처럼 만들어야하는데, Entity를 사용하면 자동으로 만들어진다.
 * @example
 * Create table USER (
 *  id int PRIMARY KEY AUTO_INCREMENT,
 *  firstName varchar(255),
 *  lastName varchar(255),
 *  age int
 * )
 */

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  age: number
}
