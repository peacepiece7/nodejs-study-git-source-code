# ORM

데이터 베이스 추상화 계층

## Database Driver

- 저수준 추상화
- Driver를 사용해서 SQL로 직접 쿼리를 날림

## Query Builder

- 중간수준 추상화
- SQL을 직접 작성하지 않고, 코드로 쿼리를 작성함 (SQL을 생성해주는 라이브러리)
- 대표적으로 knex이 있음.

## ORM

- 최고수준 추상화
- SQL을 직접 작성하지 않고, 코드로 데이터베이스를 다룸
- sequelize, typeORM, prisma 등 이 있음

## 순서

### docker-compose로 postgresql 서버 실행

1. express 서버 생성
2. typeORM 설치
3. npx typeorm init
4. docker-compose.yml 생성 후 `docker-compose up -d` 실행
   4-1. -d 옵션은 백그라운드 독립 실행을 말하는데, 이 옵션을 안키면 비밀번호가 틀리다는 에러가 발생함

### pgAdmin

데이터베이스 관리 GUI 툴로 mySQL의 workbench, DBeaver같은 역할을 함

## 참고

https://orkhan.gitbook.io/typeorm/docs/example-with-express
