const express = require('express')
const path = require('path')
const { users } = require('./data')

const PORT = 8080
const HOST = '0.0.0.0'

const app = express()

app.use(express.json()) // post의 body를 json으로 파싱
app.use(express.static('public')) // 정적 파일 제공

app.set('view engine', 'hps') // pug 템플릿 엔진 사용
app.set('views', path.join(__dirname, 'vies')) // 템플릿 파일 경로 설정

// middleware, cookieParser, bodyParser 등 일련의 미들웨어 기능 호출
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.get('/users', (req, res) => {
  res.json(users)
})

app.get('/users/:userId', (req, res) => {
  const userId = Number(req.params.userId)
  const user = users[userId]
  if (user) {
    res.json(user)
  } else {
    res.sendStatus(404)
  }
})

app.post('/users', (req, res) => {
  if (!req.body.name) {
    res.status(400).json({
      error: 'name is required',
    })
    return
  }

  const user = req.body
  users.push(user)
  res.json(user)
})

app.get('/foo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'foo.jpg'))
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})

/**
 * res.send VS res.json
 * https://github.com/expressjs/express/blob/master/lib/response.js#L239
 *
 * res.json에 문자열 전달 시, res.json이 res.send를 호출함
 *
 * object => res.json
 * string => res.send 를 사용하하자.
 */

/**
 * res.send VS res.end
 *
 * res.end : 세션을 종료합니다. 404, 500 등의 상태코드를 전달할 때 사용합니다. Content-type, ETag가 없기때문에 대역폭 절약에 좋습니다.
 * ETag : 리소스의 특정 버전에 대한 식별자, 캐시를 위해 사용됩니다.
 */

/**
 * MVC 패턴
 * Model : DB와 상호작용 하는 부분, (ex SQL, NoSQL, ORM 등)
 * View : 사용자에서 보여지는 부분 (ex HTML, CSS, JS 등)
 * Controller : Model과 View를 연결하는 부분 (ex moddleware, router 등)
 *
 * MVC로 파일 구조 나눠야하지만 귀찮아서 생략
 */
